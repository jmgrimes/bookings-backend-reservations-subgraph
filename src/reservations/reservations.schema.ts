import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Types } from "mongoose"

@Schema()
export class Reservation {
  @Prop({ required: true }) title: string
  @Prop({ required: true }) description: string
  @Prop({ required: true }) date: Date
  @Prop({ required: true }) reservableId: Types.ObjectId
  @Prop({ required: true }) session: string
  @Prop({ required: true }) userId: Types.ObjectId
}

export type ReservationDocument = HydratedDocument<Reservation>
export const ReservationSchema = SchemaFactory.createForClass(Reservation)
