import { ReservableSession } from "../reservables"

export interface IReservationModel {
  title: string
  description: string
  date: Date
  reservableId: string
  session: ReservableSession
  userId: string
}

export interface IReservation extends IReservationModel {
  id: string
}
