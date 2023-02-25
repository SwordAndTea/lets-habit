
interface UserHabitConfig {
  current_streak: number
  longest_streak: number
  remain_recheck_chance: number
  heatmap_color: string
}

interface HabitCheckRecord {
  check_at: string
}

interface Habit {
  id: number
  name: string
  identity_to_from: string | null
  check_deadline_delay: number
  check_days: number
  creator: string
  create_at: string
}

export interface DetailedHabit {
  habit: Habit
  user_custom_config: UserHabitConfig
  check_records: HabitCheckRecord[] | null
}
