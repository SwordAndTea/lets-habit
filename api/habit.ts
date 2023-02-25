import {reqHandler} from "./base";

interface UserHabitCustomConfig {
  heatmap_color: string
}

interface CreateHabitReq {
  name: string
  identity: string | null
  cooperators: string[]
  check_days: number
  custom_config: UserHabitCustomConfig
}

export const createHabit = async (req: CreateHabitReq) => {
  return reqHandler.post(`/api/v1/habit`, req)
}

export const listHabit = async (page: number, pageSize: number) => {
  return reqHandler.get("/api/v1/habit", {
    params: {
      page: page,
      page_size: pageSize,
    }
  })
}
