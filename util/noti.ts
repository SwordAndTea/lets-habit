import {notify} from "reapop";
import store from "./store";

export const noti = {
  success: (message: string) => {
    store.dispatch(notify(message, "success"))
  },
  warning: (message: string) => {
    store.dispatch(notify(message, "warning"))
  },
  error: (message: string) => {
    store.dispatch(notify(message, "error"))
  },
}
