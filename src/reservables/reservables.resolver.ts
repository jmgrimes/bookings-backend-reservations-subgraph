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
  IReservation,
  IReservationsService,
  RESERVATIONS_SERVICE,
} from "../reservations"

import { IReservablesService, RESERVABLES_SERVICE } from "./reservables.service"
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

@Resolver("Reservable")
export class ReservablesResolver {
  constructor(
    @Inject(forwardRef(() => RESERVABLES_SERVICE))
    private reservablesService: IReservablesService,
    @Inject(forwardRef(() => RESERVATIONS_SERVICE))
    private reservationsService: IReservationsService,
  ) {}

  @ResolveField("reservations")
  async reservations(
    @Parent() reservable: IReservable,
  ): Promise<IReservation[]> {
    return this.reservationsService.findByReservableId(reservable.id)
  }

  @Query()
  async reservable(@Args("id") id: string): Promise<IReservable | undefined> {
    return this.reservablesService.findById(id)
  }

  @Query()
  async reservables(@Args("ids") ids?: string[]): Promise<IReservable[]> {
    return this.reservablesService.findAll(ids)
  }

  @Query()
  async reservablesByType(
    @Args("type") type: ReservableType,
  ): Promise<IReservable[]> {
    return this.reservablesService.findByType(type)
  }

  @Mutation()
  async reservableCreate(
    @Args("reservable") reservableInput: ReservableInput,
  ): Promise<IReservablePayload> {
    return this.reservablesService
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
    @Args("id") id: string,
    @Args("reservable") reservableInput: ReservableInput,
  ): Promise<IReservablePayload> {
    return this.reservablesService
      .updateById(id, reservableInput)
      .then((reservable) => ({
        reservable,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }

  @Mutation()
  async reservableDelete(@Args("id") id: string): Promise<IReservablePayload> {
    return this.reservablesService
      .deleteById(id)
      .then((reservable) => ({
        reservable,
      }))
      .catch((error) => ({
        errors: [{ message: error }],
      }))
  }
}
