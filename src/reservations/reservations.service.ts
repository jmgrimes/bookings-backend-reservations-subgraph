import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { MongoDataSource } from "apollo-datasource-mongodb"
import { Model, Types } from "mongoose"
import { ReservableSession } from "../reservables"

import { Reservation, ReservationDocument } from "./reservations.schema"
import { IReservation, IReservationModel } from "./reservations.model"

export const RESERVATIONS_SERVICE = "RESERVATIONS_SERVICE"

export interface IReservationsService {
  findById(id: string): Promise<IReservation | undefined>
  findByReservableId(reservableId: string): Promise<IReservation[]>
  findByUserId(userId: string): Promise<IReservation[]>
  findAll(ids?: string[]): Promise<IReservation[]>
  create(reservableModel: IReservationModel): Promise<IReservation>
  updateById(
    id: string,
    reservableModel: IReservationModel,
  ): Promise<IReservation | undefined>
  deleteById(id: string): Promise<IReservation | undefined>
}

@Injectable()
export class ReservationsService
  extends MongoDataSource<ReservationDocument>
  implements IReservationsService
{
  constructor(
    @InjectModel(Reservation.name)
    reservationModel: Model<ReservationDocument>,
  ) {
    super({
      modelOrCollection: reservationModel,
    })
  }

  async findById(id: string): Promise<IReservation | undefined> {
    return this.findOneById(new Types.ObjectId(id)).then(this.toReservation)
  }

  async findByReservableId(reservableId: string): Promise<IReservation[]> {
    const ids = await this.findIdsByReservableId(reservableId)
    const reservationDocuments = await this.findManyByIds(ids)
    return reservationDocuments.map(this.toReservation)
  }

  async findByUserId(userId: string): Promise<IReservation[]> {
    const ids = await this.findIdsByUserId(userId)
    const reservationDocuments = await this.findManyByIds(ids)
    return reservationDocuments.map(this.toReservation)
  }

  async findAll(ids?: string[]): Promise<IReservation[]> {
    const reservationDocuments = await this.findManyByIds(
      ids ? ids.map((id) => new Types.ObjectId(id)) : await this.findAllIds(),
    )
    return reservationDocuments.map(this.toReservation)
  }

  async create(reservationModel: IReservationModel): Promise<IReservation> {
    return this.model.create(reservationModel).then(this.toReservation)
  }

  async updateById(
    id: string,
    reservationModel: IReservationModel,
  ): Promise<IReservation | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    await this.model.findByIdAndUpdate(objectId, reservationModel).exec()
    return this.findOneById(objectId).then(this.toReservation)
  }

  async deleteById(id: string): Promise<IReservation | undefined> {
    const objectId = new Types.ObjectId(id)
    await this.deleteFromCacheById(objectId)
    return this.model
      .findByIdAndDelete(objectId)
      .exec()
      .then((result) => {
        return this.toReservation(result.value)
      })
  }

  private async findAllIds(): Promise<Types.ObjectId[]> {
    const reservations = await this.model.find({}, ["_id"]).exec()
    return reservations.map((reservation) => reservation._id)
  }

  private async findIdsByReservableId(
    reservableId: string,
  ): Promise<Types.ObjectId[]> {
    const reservations = await this.model.find({ reservableId }, ["_id"]).exec()
    return reservations.map((reservation) => reservation._id)
  }

  private async findIdsByUserId(userId: string): Promise<Types.ObjectId[]> {
    const reservations = await this.model.find({ userId }, ["_id"]).exec()
    return reservations.map((reservation) => reservation._id)
  }

  private toReservation(
    reservationDocument: ReservationDocument,
  ): IReservation {
    return {
      id: reservationDocument._id.toHexString(),
      title: reservationDocument.title,
      description: reservationDocument.description,
      date: reservationDocument.date,
      reservableId: reservationDocument.reservableId.toHexString(),
      session: ReservableSession[reservationDocument.session],
      userId: reservationDocument.userId.toHexString(),
    }
  }
}
