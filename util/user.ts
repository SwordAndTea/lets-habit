import {RoutePath, UserLocalStorageKey} from "./const";
import {GetServerSidePropsContext, PreviewData} from "next";
import {ParsedUrlQuery} from "querystring";
import {getUserInfo} from "../api/user";

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
