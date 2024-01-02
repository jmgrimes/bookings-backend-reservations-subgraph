import { Module, Scope } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { ReservationsResolver } from "./reservations.resolver"
import { Reservation, ReservationSchema } from "./reservations.schema"
import {
  ReservationsService,
  RESERVATIONS_SERVICE,
} from "./reservations.service"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservation.name,
        schema: ReservationSchema,
      },
    ]),
  ],
  exports: [
    {
      provide: RESERVATIONS_SERVICE,
      useClass: ReservationsService,
      scope: Scope.DEFAULT,
    },
  ],
  providers: [
    ReservationsResolver,
    {
      provide: RESERVATIONS_SERVICE,
      useClass: ReservationsService,
      scope: Scope.DEFAULT,
    },
  ],
})
export class ReservationsModule {}
