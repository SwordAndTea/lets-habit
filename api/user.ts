import {apiV1, reqHandler} from "./base";
import exp from "constants";

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

export const sendResetPasswordVerifyCode = async (email: string) => {
  return reqHandler.post(`${apiV1}/user/password/reset/send-verify-code`, {email: email})
}

export const resetPassword = async (email: string, verifyCode: string, newPassword: string) => {
  return reqHandler.post(`${apiV1}/user/password/reset`, {
    email: email,
    code: verifyCode,
    new_password: newPassword,
  })
}

export const signOut = async () => {
  return reqHandler.post(`${apiV1}/user/sign-out`)
}

export const deleteUser = async () => {
  return reqHandler.delete(`${apiV1}/user`)
}
