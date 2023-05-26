import {apiV1, reqHandler} from "./base";

export const getUserInfo = async (extraCookie?: string) => {
  return reqHandler.get(`${apiV1}/user`, {
    headers: extraCookie ? {Cookie: extraCookie} : undefined
  })
}

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`${apiV1}/user/login/email`, {email: email, password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`${apiV1}/user/register/email`, {email: email, password: password})
}

export const userEmailActivateResend = async () => {
  return reqHandler.post(`${apiV1}/user/register/email/activate/resend`)
}

export const userEmailActivate = async (activeCode: string) => {
  return reqHandler.post(`${apiV1}/user/register/email/activate`, {activate_code: activeCode})
}

export const userSearch = async (text: string) => {
  return reqHandler.post(`${apiV1}/user/search`, {name_or_uid: text})
}

interface UpdateUserBaseInfoReq {
  name: string
  portrait: string
}

export const updateUserBaseInfo = async (req: UpdateUserBaseInfoReq) => {
  return reqHandler.put(`${apiV1}/user/base`, req)
}
