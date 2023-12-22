import { forwardRef, Module } from "@nestjs/common"

import ReservationsModule from "../reservations"

import { UsersResolver } from "./users.resolver"

@Module({
  imports: [forwardRef(() => ReservationsModule)],
  providers: [UsersResolver],
})
export class UsersModule {}
