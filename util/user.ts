import {RoutePath} from "./const";
import {GetServerSideProps,} from "next";
import {getUserInfo} from "../api/user";
import store, {userSlice} from "./store";

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

export const CommonServerGetSideUserProp = (toHomePage: boolean, toLoginPage: boolean): GetServerSideProps => {
  return async (context) => {
    return await getUserInfo(context.req.headers.cookie).then((resp) => {
      if (resp.headers["set-cookie"]) {
        context.res.setHeader('set-cookie', resp.headers["set-cookie"])
      }
      if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
        return {
          redirect: {
            destination: RoutePath.EmailActivateSendPage,
            permanent: false,
          }
        }
      }
      if (toHomePage) {
        return {
          redirect: {
            destination: `${RoutePath.HomePage}?page=1`,
            permanent: false,
          }
        }
      }
      return {
        props: {
          user: resp.data.data.user
        }
      }
    }).catch(() => {
      if (toLoginPage) {
        return {
          redirect: {
            destination: RoutePath.LoginPage,
            permanent: false,
          }
        }
      }

      return {
        props: {}
      }
    })
  }
}

export function setUserStore(user: User) {
  store.dispatch(userSlice.actions.set(user))
}

export interface PageUserProp {
  user: User
}
