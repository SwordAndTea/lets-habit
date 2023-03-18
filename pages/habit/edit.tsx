import styles from './edit_new.module.css'
import React, {useEffect, useState} from "react";
import {DetailedHabit} from "../../util/habit";
import {HabitIDURLParam} from "../../util/const";
import {UserSearcher} from "../../components/search";
import {WeekdayChooser} from "../../components/weekday_chooser";
import Heatmap from "../../components/heatmap";
import {CalculatedStartDay} from "../../util/date";
import {useRouter} from "next/router";
import {HabitInfoItemWrap} from "../../components/habit_new_edit_shared";
import {GetLocalUserInfo, SimplifiedUser} from "../../util/user";
import {getHabit} from "../../api/habit";
import {noti} from "../../util/noti";


export default function EditHabitPage() {
  const route = useRouter()

  const [habit, setHabit] = useState<DetailedHabit | null>(null)
  const [curUser, setCurUser] = useState<SimplifiedUser | null>(null)
  const [newName, setNewName] = useState("")
  const [newIdentity, setNewIdentity] = useState("")
  const [newCooperators, setNewCooperators] = useState<SimplifiedUser[]>([])
  const [heatmapColor, setHeatmapColor] = useState("")
  const [isHabitOwner, setIsHabitOwner] = useState(false)

  let heatmapEndDate = new Date()
  let heatmapStartDate = CalculatedStartDay()

  useEffect(() => {
    let habitID = parseInt(route.query[HabitIDURLParam] as string)
    if (habitID) {
      getHabit(habitID).then((resp) => {
        if (resp.data && resp.data.data && resp.data.data.habit) {
          let habitInfo = resp.data.data.habit
          console.log(habitInfo)
          setHabit(habitInfo)
          let userInfo = GetLocalUserInfo()

          if (habitInfo && userInfo && habitInfo.habit.owner == userInfo.uid) {
            setIsHabitOwner(true)
          }
          if (habitInfo) {
            setHeatmapColor(habitInfo.user_custom_config.heatmap_color)
          }
          if (userInfo) {
            setCurUser(userInfo)
          }
        } else {
          noti.error("cannot parse get habit response")
        }
      })
    }
  }, [route])

  const handleUpdate = () => {

  }

  return (
    <div className={styles.editNewOutsideContainer}>
      {/*form*/}
      <div className={styles.editNewForm}>
        <HabitInfoItemWrap name="Habit Name">
          <input type="text"
                 className={styles.editNewTextInput}
                 defaultValue={habit?.habit.name}
                 onChange={(e) => {
                   setNewName(e.target.value)
                 }}
                 disabled={!isHabitOwner}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Identity To From">
          <input type="text"
                 className={styles.editNewTextInput}
                 defaultValue={habit?.habit.identity ? habit?.habit.identity : ""}
                 onChange={(e) => {
                   setNewIdentity(e.target.value)
                 }}
                 disabled={!isHabitOwner}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Friends To Invite">
          <UserSearcher
            className={styles.editNewUserSearcher}
            inputClassName={styles.editNewUserSearcherInput}
            resultContainerClassName=""
            resultItemClassName=""
            fixedUsers={curUser ? [curUser] : undefined}
            defaultUsers={habit?.cooperators}
            onSelectUserChange={(users) => {
              setNewCooperators(users)
            }}
            disabled={!isHabitOwner}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Check Days">
          <WeekdayChooser
            className={styles.editNewWeekdayChooser}
            defaultChooseDays={habit?.habit.log_days}
            disabled
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Heatmap Customization">
          <div className={styles.editNewHeatmap}>
            <input
              className="mb-4"
              type="color"
              defaultValue={habit?.user_custom_config.heatmap_color}
              onChange={(e) => {
                setHeatmapColor(e.target.value)
              }}
            />
            <Heatmap
              color={heatmapColor ? heatmapColor : "#f5317f"}
              startDate={heatmapStartDate}
              endDate={heatmapEndDate}
              data={[]}
              fillAll
            />
          </div>
        </HabitInfoItemWrap>

        {/*cancel & commit btn*/}
        <div className={styles.editNewBtnContainer}>
          <button
            className={styles.editNewCancelBtn}
            onClick={() => route.back()}
          >
            Cancel
          </button>
          <button
            className={styles.editNewConfirmBtn}
            onClick={handleUpdate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
