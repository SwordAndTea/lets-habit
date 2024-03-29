import axios from "axios";
import {noti} from "../util/noti";

export const apiV1 = "api/v1"

export const reqHandler = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
  withCredentials: true
})

reqHandler.interceptors.response.use((resp) => {
  return resp
}, function (err) {
  let msg = ""
  let isAuthFail = false
  if (err.response && err.response.data && err.response.data.meta &&
    err.response.data.meta.message && err.response.data.meta.status) {
    msg = err.response.data.meta.message
    if (err.response.data.meta.status == 9999) {
      noti.error(`${err.message}: ${err.response.data.meta.message}`)
    } else {
      noti.warning(`${err.message}: ${err.response.data.meta.message}`)
    }
    isAuthFail = err.response.data.meta.status == 1101
  } else {
    msg = err.message
    noti.error(err.message)
  }
  return Promise.reject({err: err, msg: msg, isAuthFail: isAuthFail})
});
