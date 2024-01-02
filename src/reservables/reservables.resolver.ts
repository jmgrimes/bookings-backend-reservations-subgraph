import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql"

import { IReservation, IReservationsService } from "../reservations"

import { IReservablesService } from "./reservables.service"
import {
  IReservable,
  IReservableModel,
  IReservablePayload,
  ReservableDay,
  ReservableSession,
  ReservableType,
} from "./reservables.model"

export class ReservableInput implements IReservableModel {
  name: string
  description: string
  type: ReservableType
  days: ReservableDay[]
  sessions: ReservableSession[]
}

export interface IContext {
  reservablesService: IReservablesService
  reservationsService: IReservationsService
}

@Resolver("Reservable")
export class ReservablesResolver {
  constructor() {}

  @ResolveField("reservations")
  async reservations(
    @Context() context: IContext,
    @Parent() reservable: IReservable,
  ): Promise<IReservation[]> {
    return context.reservationsService.findByReservableId(reservable.id)
  }

  @Query()
  async reservable(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IReservable | undefined> {
    return context.reservablesService.findById(id)
  }

  @Query()
  async reservables(
    @Context() context: IContext,
    @Args("ids") ids?: string[],
  ): Promise<IReservable[]> {
    return context.reservablesService.findAll(ids)
  }

  @Query()
  async reservablesByType(
    @Context() context: IContext,
    @Args("type") type: ReservableType,
  ): Promise<IReservable[]> {
    return context.reservablesService.findByType(type)
  }

  @Mutation()
  async reservableCreate(
    @Context() context: IContext,
    @Args("reservable") reservableInput: ReservableInput,
  ): Promise<IReservablePayload> {
    return context.reservablesService
      .create(reservableInput)
      .then((reservable) => ({
        reservable,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async reservableUpdate(
    @Context() context: IContext,
    @Args("id") id: string,
    @Args("reservable") reservableInput: ReservableInput,
  ): Promise<IReservablePayload> {
    return context.reservablesService
      .updateById(id, reservableInput)
      .then((reservable) => ({
        reservable,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async reservableDelete(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IReservablePayload> {
    return context.reservablesService
      .deleteById(id)
      .then((reservable) => ({
        reservable,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
