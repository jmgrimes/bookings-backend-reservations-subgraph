import { forwardRef, Inject } from "@nestjs/common"
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql"

import {
  IReservable,
  IReservablesService,
  ReservableSession,
  RESERVABLES_SERVICE,
} from "../reservables"
import { IUser } from "../users"

import {
  IReservationsService,
  RESERVATIONS_SERVICE,
} from "./reservations.service"
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

@Resolver("Reservation")
export class ReservationsResolver {
  constructor(
    @Inject(forwardRef(() => RESERVATIONS_SERVICE))
    private reservationsService: IReservationsService,
    @Inject(forwardRef(() => RESERVABLES_SERVICE))
    private reservablesService: IReservablesService,
  ) {}

  @ResolveField("reservable")
  async reservable(
    @Parent() reservation: IReservation,
  ): Promise<IReservable | undefined> {
    return this.reservablesService.findById(reservation.reservableId)
  }

  @ResolveField("user")
  async user(@Parent() reservation: IReservation): Promise<IUser | undefined> {
    return {
      id: reservation.userId,
    }
  }

  @Query()
  async reservation(@Args("id") id: string): Promise<IReservation | undefined> {
    return this.reservationsService.findById(id)
  }

  @Query()
  async reservations(@Args("ids") ids?: string[]): Promise<IReservation[]> {
    return this.reservationsService.findAll(ids)
  }

  @Mutation()
  async reservationCreate(
    @Args("reservation") reservationInput: ReservationInput,
  ): Promise<IReservationPayload> {
    return await this.reservationsService
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
    @Args("id") id: string,
    @Args("reservation") reservationInput: ReservationInput,
  ): Promise<IReservationPayload> {
    return this.reservationsService
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
    @Args("id") id: string,
  ): Promise<IReservationPayload> {
    return this.reservationsService
      .deleteById(id)
      .then((reservation) => ({
        reservation,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
