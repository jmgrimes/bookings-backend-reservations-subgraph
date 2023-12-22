import { forwardRef, Inject } from "@nestjs/common"
import { Parent, ResolveField, Resolver } from "@nestjs/graphql"

import {
  IReservation,
  IReservationsService,
  RESERVATIONS_SERVICE,
} from "../reservations"

import { IUser } from "./users.model"

@Resolver("User")
export class UsersResolver {
  constructor(
    @Inject(forwardRef(() => RESERVATIONS_SERVICE))
    private reservationsService: IReservationsService,
  ) {}

  @ResolveField("reservations")
  async reservations(@Parent() user: IUser): Promise<IReservation[]> {
    return this.reservationsService.findByUserId(user.id)
  }
}
