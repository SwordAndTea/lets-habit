import {UserLocalStorageKey} from "./const";

export interface User {
  uid: string
  name: string | null
  email: string | null
  email_activate: string | null
  portrait: string | null
  user_register_type: string
}

export const InitialUser = {
  email: "",
  email_activate: null,
  name: null,
  portrait: null,
  uid: "",
  user_register_type: ""
}

export function GetLocalUserInfo(): User | null {
  let userInfo = localStorage.getItem(UserLocalStorageKey)
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return null
}
