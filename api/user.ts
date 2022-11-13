import axios from "axios";

const reqHandler = axios.create({
  baseURL: "http://127.0.0.1:8888" //TODO: replace backend host with deploy env
})

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`/api/v1/user/login/email`, {email: email, password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`/api/v1/user/register/email`, {email: email, password: password})
}


