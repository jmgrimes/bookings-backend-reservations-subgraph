export enum ReservableType {
  Equipment = "Equipment",
  Room = "Room",
}

export enum ReservableDay {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export enum ReservableSession {
  Breakfast = "Breakfast",
  Morning = "Morning",
  Lunch = "Lunch",
  Afternoon = "Afternoon",
  Evening = "Evening",
}

export interface IReservableModel {
  name: string
  description: string
  type: ReservableType
  days: ReservableDay[]
  sessions: ReservableSession[]
}

export interface IReservable extends IReservableModel {
  id: string
}
