import { ReservablesModule } from "./reservables.module"

export {
  IReservable,
  IReservableModel,
  ReservableSession,
  ReservableDay,
  ReservableType,
} from "./reservables.model"
export { IReservablesService, RESERVABLES_SERVICE } from "./reservables.service"
export default ReservablesModule
