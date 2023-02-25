import {reqHandler} from "./base";


export const userPing = async () => {
  return reqHandler.get(`/api/v1/user/ping`)
}

export const getUserInfo = async () => {
  return reqHandler.get(`/api/v1/user`)
}

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`/api/v1/user/login/email`, {email: email, password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`/api/v1/user/register/email`, {email: email, password: password})
}

export const userEmailActivateResend = async () => {
  return reqHandler.post(`/api/v1/user/register/email/activate/resend`)
}

export const userEmailActivate = async (activeCode: string) => {
  return reqHandler.post(`/api/v1/user/register/email/activate`, {activate_code: activeCode})
}

export const userSearch = async (text: string) => {
  return reqHandler.post(`/api/v1/user/search`, {name_or_uid: text})
}
