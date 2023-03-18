import {apiV1, reqHandler} from "./base";

interface UserHabitCustomConfig {
  heatmap_color: string
}

interface CreateHabitReq {
  name: string
  identity: string | null
  cooperators: string[]
  log_days: number
  custom_config: UserHabitCustomConfig
}

export const createHabit = async (req: CreateHabitReq) => {
  return reqHandler.post(`${apiV1}/habit`, req)
}

export const getHabit = async (habitID: number) => {
  return reqHandler.get(`${apiV1}/habit/${habitID}`)
}

export const listHabit = async (page: number, pageSize: number, fromTime: string, toTime: string) => {
  return reqHandler.get(`${apiV1}/habit/list`, {
    params: {
      page: page,
      page_size: pageSize,
      from_time: fromTime,
      to_time: toTime,
    }
  })
}

export const logHabit = async (habitID: number, logTime: string) => {
  return reqHandler.post(`${apiV1}/habit/log/${habitID}`, {
    log_time: logTime
  })
}
