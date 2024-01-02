import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"
import { ApolloDriverConfig, ApolloFederationDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { MongooseModule } from "@nestjs/mongoose"

import ReservablesModule, {
  IReservablesService,
  RESERVABLES_SERVICE,
} from "./reservables"
import ReservationsModule, {
  IReservationsService,
  RESERVATIONS_SERVICE,
} from "./reservations"
import UsersModule from "./users"

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ReservablesModule, ReservationsModule],
      inject: [RESERVABLES_SERVICE, RESERVATIONS_SERVICE],
      useFactory: async (
        reservablesService: IReservablesService,
        reservationsService: IReservationsService,
      ) => ({
        context: () => ({
          reservablesService,
          reservationsService,
        }),
        path: "/api/graphql",
        playground: false,
        plugins: [
          ApolloServerPluginInlineTraceDisabled(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        typePaths: ["./**/*.graphql"],
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
    }),
    ReservablesModule,
    ReservationsModule,
    UsersModule,
  ],
})
export class AppModule {}
