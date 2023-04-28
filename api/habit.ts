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

export interface UpdateHabitReq {
  name: string | null
  identity: string | null
  cooperators_to_add: string[] | null
  cooperators_to_delete: string[] | null
}

export interface UpdateHabitCustomConfigReq {
  heatmap_color: string | null
}

export const createHabit = async (req: CreateHabitReq) => {
  return reqHandler.post(`${apiV1}/habit`, req)
}

export const updateHabit = async (habitID: number, basicInfo: UpdateHabitReq, customInfo: UpdateHabitCustomConfigReq) => {
  return reqHandler.put(`${apiV1}/habit/${habitID}`, {basic_info: basicInfo, custom_info: customInfo})
}

export const getHabit = async (habitID: number, extraCookie?: string) => {
  return reqHandler.get(`${apiV1}/habit/${habitID}`, {
    headers: extraCookie ? {Cookie: extraCookie} : undefined
  })
}

export const listHabit = async (page: number, pageSize: number, fromTime: string, toTime: string, extraCookie?: string) => {
  return reqHandler.get(`${apiV1}/habit/list`, {
    params: {
      page: page,
      page_size: pageSize,
      from_time: fromTime,
      to_time: toTime,
    },
    headers: extraCookie ? {Cookie: extraCookie} : undefined
  })
}

export const logHabit = async (habitID: number, logTime: string) => {
  return reqHandler.post(`${apiV1}/habit/log/${habitID}`, {
    log_time: logTime
  })
}

export const deleteHabit = async (habitID: number) => {
  return reqHandler.delete(`${apiV1}/habit/${habitID}`)
}
