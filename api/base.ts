import axios from "axios";
import {noti} from "../util/noti";

export const reqHandler = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST
})

reqHandler.interceptors.response.use(function (resp) {
  return resp
}, function (err) {
  let msg = ""
  let isAuthFail = false
  if (err.response && err.response.data && err.response.data.meta && err.response.data.meta.message) {
    msg = err.response.data.meta.message
    noti.error(`${err.message}: ${err.response.data.meta.message}`)
    isAuthFail = err.response.data.meta.status == 1101
  } else {
    msg = err.message
    noti.error(err.message)
  }
  return Promise.reject({err: err, msg: msg, isAuthFail: isAuthFail})
});
