import {RoutePath, UserLocalStorageKey, UserTokenHeader} from "./const";
import {AxiosResponse} from "axios";
import {NextRouter} from "next/router";

export interface User {
  uid: string
  name: string | null
  email: string | null
  email_active: string | null
  portrait: string | null
  user_register_type: string
}

export const InitialUser = {
  email: "",
  email_active: null,
  name: null,
  portrait: null,
  uid: "",
  user_register_type: ""
}

export interface SimplifiedUser {
  uid: string
  name: string | null
  portrait: string | null
}

export function GetLocalUserInfo(): User | null {
  let userInfo = localStorage.getItem(UserLocalStorageKey)
  if (userInfo) {
    return JSON.parse(userInfo)
  }
  return null
}

export const HandleUserResp = (resp: AxiosResponse, route: NextRouter) => {
  if (resp.data && resp.data.data && resp.data.data.user && resp.headers && resp.headers[UserTokenHeader]) {
    localStorage.setItem("user", JSON.stringify(resp.data.data.user))
    localStorage.setItem(UserTokenHeader, resp.headers[UserTokenHeader])
    if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
      route.push(RoutePath.EmailActivateSendPage)
    } else {
      route.push(RoutePath.HomePage)
    }
    return true
  }
  return false
}
