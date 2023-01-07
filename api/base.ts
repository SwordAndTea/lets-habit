import axios from "axios";
import {noti} from "../util/noti";

export const reqHandler = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST
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
