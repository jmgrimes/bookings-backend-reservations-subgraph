import { Module, Scope } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"

import { ReservablesResolver } from "./reservables.resolver"
import { Reservable, ReservableSchema } from "./reservables.schema"
import { ReservablesService, RESERVABLES_SERVICE } from "./reservables.service"

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reservable.name,
        schema: ReservableSchema,
      },
    ]),
  ],
  exports: [
    {
      provide: RESERVABLES_SERVICE,
      useClass: ReservablesService,
      scope: Scope.DEFAULT,
    },
  ],
  providers: [
    ReservablesResolver,
    {
      provide: RESERVABLES_SERVICE,
      useClass: ReservablesService,
      scope: Scope.DEFAULT,
    },
  ],
})
export class ReservablesModule {}
