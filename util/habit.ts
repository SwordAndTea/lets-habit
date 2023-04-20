import {SimplifiedUser} from "./user";

interface UserHabitConfig {
  current_streak: number
  longest_streak: number
  remain_retroactive_chance: number
  heatmap_color: string
}

interface HabitLogRecord {
  log_at: string
}

interface Habit {
  id: number
  name: string
  identity: string | null
  log_days: number
  owner: string
  create_at: string
}

export interface DetailedHabit {
  habit: Habit
  user_custom_config: UserHabitConfig
  log_records: HabitLogRecord[] | null
  today_logged: boolean
  cooperators: SimplifiedUser[]
  cooperator_log_status: Map<string, boolean>
}

export enum Weekday {
  Sunday = 1 << 0,
  Monday = 1 << 1,
  Tuesday = 1 << 2,
  Wednesday = 1 << 3,
  Thursday = 1 << 4,
  Friday = 1 << 5,
  Saturday = 1 << 6,
  All = Weekday.Monday | Weekday.Tuesday | Weekday.Wednesday | Weekday.Thursday | Weekday.Friday | Weekday.Saturday | Weekday.Sunday
}
