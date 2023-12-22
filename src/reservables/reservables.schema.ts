import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument } from "mongoose"

@Schema()
export class Reservable {
  @Prop({ required: true }) name: string
  @Prop({ required: true }) description: string
  @Prop({ required: true }) type: string
  @Prop({ required: true }) days: string[]
  @Prop({ required: true }) sessions: string[]
}

export type ReservableDocument = HydratedDocument<Reservable>
export const ReservableSchema = SchemaFactory.createForClass(Reservable)
