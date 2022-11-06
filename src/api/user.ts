import axios from "axios";

const reqHandler = axios.create({
  baseURL: "http://localhost:8888" //TODO: replace backend host with deploy env
})

export const userLoginByEmail = async (email: string, passport: string) => {
  return reqHandler.post(`/api/v1/user/login/email`, {Email: email, Password: passport})
}

export const userRegisterByEmail = async (email: string, password: string) => {
  return reqHandler.post(`/api/v1/user/register/email`, {Email: email, Password: password})
}


