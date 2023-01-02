import axios from "axios";
import {noti} from "../util/noti";

export const reqHandler = axios.create({
  baseURL: "http://127.0.0.1:8888" //TODO: replace backend host with deploy env
})

reqHandler.interceptors.response.use(function (resp) {
  return resp
}, function (err) {
  if (err.response && err.response.data && err.response.data.meta && err.response.data.meta.message) {
    noti.error(`${err.message}: ${err.response.data.meta.message}`)
  } else {
    noti.error(err.message)
  }
  return Promise.reject(err.message)
});