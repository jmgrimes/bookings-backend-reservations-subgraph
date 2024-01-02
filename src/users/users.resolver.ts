import { forwardRef, Inject } from "@nestjs/common"
import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql"

import {
  IReservation,
  IReservationsService,
  RESERVATIONS_SERVICE,
} from "../reservations"

import { IUser } from "./users.model"

export interface IContext {
  reservationsService: IReservationsService
}

@Resolver("User")
export class UsersResolver {
  constructor(
    @Inject(forwardRef(() => RESERVATIONS_SERVICE))
    private reservationsService: IReservationsService,
  ) {}

  @ResolveField("reservations")
  async reservations(
    @Context() context: IContext,
    @Parent() user: IUser,
  ): Promise<IReservation[]> {
    return context.reservationsService.findByUserId(user.id)
  }
}
