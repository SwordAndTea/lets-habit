import {reqHandler} from "./base";

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`/api/v1/user/login/email`, {email: email, password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`/api/v1/user/register/email`, {email: email, password: password})
}

export const userEmailActivateCheck = async (uid: string) => {
  return reqHandler.get(`/api/v1/user/register/email/check?uid=${uid}`)
}

export const userEmailActivateResend = async (uid: string) => {
  return reqHandler.post(`/api/v1/user/register/email/resend`, {uid: uid})
}



