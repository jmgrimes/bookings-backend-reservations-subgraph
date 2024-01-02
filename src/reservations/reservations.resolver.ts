import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import {
  IReservable,
  IReservablesService,
  ReservableSession,
} from "../reservables"
import { IUser } from "../users"

import { IReservationsService } from "./reservations.service"
import {
  IReservation,
  IReservationModel,
  IReservationPayload,
} from "./reservations.model"

export class ReservationInput implements IReservationModel {
  title: string
  description: string
  date: Date
  reservableId: string
  session: ReservableSession
  userId: string
}

export interface IContext {
  reservablesService: IReservablesService
  reservationsService: IReservationsService
}

@Resolver("Reservation")
export class ReservationsResolver {
  constructor() {}

  @ResolveField("reservable")
  async reservable(
    @Context() context: IContext,
    @Parent() reservation: IReservation,
  ): Promise<IReservable | undefined> {
    return context.reservablesService.findById(reservation.reservableId)
  }

  @ResolveField("user")
  async user(@Parent() reservation: IReservation): Promise<IUser | undefined> {
    return {
      id: reservation.userId,
    }
  }

  @Query()
  async reservation(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IReservation | undefined> {
    return context.reservationsService.findById(id)
  }

  @Query()
  async reservations(
    @Context() context: IContext,
    @Args("ids") ids?: string[],
  ): Promise<IReservation[]> {
    return context.reservationsService.findAll(ids)
  }

  @Mutation()
  async reservationCreate(
    @Context() context: IContext,
    @Args("reservation") reservationInput: ReservationInput,
  ): Promise<IReservationPayload> {
    return await context.reservationsService
      .create(reservationInput)
      .then((reservation) => ({
        reservation,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async reservationUpdate(
    @Context() context: IContext,
    @Args("id") id: string,
    @Args("reservation") reservationInput: ReservationInput,
  ): Promise<IReservationPayload> {
    return context.reservationsService
      .updateById(id, reservationInput)
      .then((reservation) => ({
        reservation,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async reservationDelete(
    @Context() context: IContext,
    @Args("id") id: string,
  ): Promise<IReservationPayload> {
    return context.reservationsService
      .deleteById(id)
      .then((reservation) => ({
        reservation,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
