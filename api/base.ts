import axios from "axios";
import {noti} from "../util/noti";

export const reqHandler = axios.create({
  baseURL: "http://127.0.0.1:8888" //TODO: replace backend host with deploy env
})

reqHandler.interceptors.response.use(function (response) {
  return response
}, function (err) {
  noti.error(err.message)
});