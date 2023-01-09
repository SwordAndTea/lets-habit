import {reqHandler} from "./base";

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`/api/v1/user/login/email`, {email: email, password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`/api/v1/user/register/email`, {email: email, password: password})
}

export const userEmailActivateCheck = async (pollToken: string) => {
  return reqHandler.get(`/api/v1/user/register/email/activate/check?poll_token=${pollToken}`)
}

export const userEmailActivateResend = async (uid: string) => {
  return reqHandler.post(`/api/v1/user/register/email/activate/resend`, {uid: uid})
}

export const userEmailActivate = async (activeCode: string) => {
  return reqHandler.post(`/api/v1/user/register/email/activate`, {activate_code: activeCode})
}

