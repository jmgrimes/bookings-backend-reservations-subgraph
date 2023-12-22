import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongoDataSource } from "apollo-datasource-mongodb"
import { Model, Types } from "mongoose"

import {
  IReservable,
  IReservableModel,
  ReservableDay,
  ReservableSession,
  ReservableType,
} from "./reservables.model"
import { Reservable, ReservableDocument } from "./reservables.schema"

export const RESERVABLES_SERVICE = "RESERVABLES_SERVICE"

export interface IReservablesService {
  findById(id: string): Promise<IReservable | undefined>
  findByType(type: ReservableType): Promise<IReservable[]>
  findAll(ids?: string[]): Promise<IReservable[]>
  create(reservableModel: IReservableModel): Promise<IReservable>
  updateById(
    id: string,
    reservableModel: IReservableModel,
  ): Promise<IReservable | undefined>
  deleteById(id: string): Promise<IReservable | undefined>
}

@Injectable()
export class ReservablesService
  extends MongoDataSource<ReservableDocument>
  implements IReservablesService
{
  constructor(
    @InjectModel(Reservable.name) reservableModel: Model<ReservableDocument>,
  ) {
    super({
      modelOrCollection: reservableModel,
    })
  }

  async findById(id: string): Promise<IReservable | undefined> {
    return this.findOneById(new Types.ObjectId(id)).then(this.toReservable)
  }

  async findByType(type: ReservableType): Promise<IReservable[]> {
    const ids = await this.findIdsByType(type)
    const reservableDocuments = await this.findManyByIds(ids)
    return reservableDocuments.map(this.toReservable)
  }

  async findAll(ids?: string[]): Promise<IReservable[]> {
    const reservableDocuments = await this.findManyByIds(
      ids ? ids.map((id) => new Types.ObjectId(id)) : await this.findAllIds(),
    )
    return reservableDocuments.map(this.toReservable)
  }

  async create(reservableModel: IReservableModel): Promise<IReservable> {
    return this.model.create(reservableModel).then(this.toReservable)
  }

  async updateById(
    id: string,
    reservableModel: IReservableModel,
  ): Promise<IReservable | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    await this.model.findByIdAndUpdate(objectId, reservableModel).exec()
    return this.findOneById(objectId).then(this.toReservable)
  }

  async deleteById(id: string): Promise<IReservable | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    return this.model
      .findByIdAndDelete(objectId)
      .exec()
      .then((result) => {
        return this.toReservable(result.value)
      })
  }

  private async findAllIds(): Promise<Types.ObjectId[]> {
    const reservations = await this.model.find({}, ["_id"]).exec()
    return reservations.map((reservation) => reservation._id)
  }

  private async findIdsByType(type: ReservableType): Promise<Types.ObjectId[]> {
    const reservations = await this.model.find({ type }, ["_id"]).exec()
    return reservations.map((reservation) => reservation._id)
  }

  private toReservable(reservableDocument: ReservableDocument): IReservable {
    return {
      id: reservableDocument._id.toHexString(),
      name: reservableDocument.name,
      description: reservableDocument.description,
      type: ReservableType[reservableDocument.type],
      days: reservableDocument.days.map((day) => ReservableDay[day]),
      sessions: reservableDocument.sessions.map(
        (session) => ReservableSession[session],
      ),
    }
  }
}
