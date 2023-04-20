import styles from './edit_new.module.css'
import {UserSearcher} from "../../components/search";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {SpinWaitIndicatorIcon} from "../../components/icons";
import Heatmap from "../../components/heatmap";
import {GetLocalUserInfo, SimplifiedUser} from "../../util/user";
import {createHabit} from "../../api/habit";
import {Weekday} from "../../util/habit";
import {WeekdayChooser} from "../../components/weekday_chooser";
import {CalculatedStartDay} from "../../util/date";
import {HabitInfoItemWrap} from "../../components/habit_new_edit_shared";


export default function NewHabitPage() {
  const route = useRouter()

  const [curUser, setCurUser] = useState<SimplifiedUser | null>(null)

  const [isCreating, setIsCreating] = useState(false)
  const [habitName, setHabitName] = useState("")
  const [identity, setIdentity] = useState("")
  const [cooperators, setCooperators] = useState<SimplifiedUser[]>([])
  const [logDays, setLogDays] = useState(Weekday.All)
  const defaultHeatmapColor = "#f5317f"
  const [heatmapColor, setHeatmapColor] = useState(defaultHeatmapColor)

  let heatmapEndDate = new Date()
  let heatmapStartDate = CalculatedStartDay()

  useEffect(() => {
    let userInfo = GetLocalUserInfo()
    if (userInfo) {
      setCurUser(userInfo)
    }
  }, [])

  const handleCreate = () => {
    setIsCreating(true)
    let cooperatorIDs = cooperators.map((value) => {
      return value.uid
    })
    let createHabitReq = {
      name: habitName,
      identity: identity ? identity : null,
      cooperators: cooperatorIDs,
      log_days: logDays,
      custom_config: {
        heatmap_color: heatmapColor
      }
    }
    createHabit(createHabitReq).then(() => {
      route.back()
    }).finally(() => {
      setIsCreating(false)
    })
  }

  return (
    <div className={styles.editNewOutsideContainer}>
      {/*form*/}
      <div className={styles.editNewForm}>
        <HabitInfoItemWrap name="Habit Name">
          <input type="text" className={styles.editNewTextInput} onChange={(e) => {
            setHabitName(e.target.value)
          }}/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Identity To From">
          <input type="text" className={styles.editNewTextInput} onChange={(e) => {
            setIdentity(e.target.value)
          }
          }/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Friends To Invite">
          <UserSearcher
            className={styles.editNewUserSearcher}
            inputClassName={styles.editNewUserSearcherInput}
            resultContainerClassName=""
            resultItemClassName=""
            fixedUsers={curUser ? [curUser] : undefined}
            onSelectUserChange={(users) => {
              setCooperators(users)
            }}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Check Days">
          <WeekdayChooser
            className={styles.editNewWeekdayChooser}
            onChooseChange={(v) => {
              setLogDays(v)
            }}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Heatmap Customization">
          <div className={styles.editNewHeatmap}>
            <div className={styles.editNewColorPickerContainer} style={{backgroundColor: heatmapColor}}>
              <input
                id="heatmap-color-picker"
                className="opacity-0"
                type="color"
                defaultValue={defaultHeatmapColor}
                onChange={(e) => {
                  setHeatmapColor(e.target.value)
                }}
              />
            </div>
            <Heatmap
              color={heatmapColor}
              startDate={heatmapStartDate}
              endDate={heatmapEndDate}
              data={[]}
              fillAll
            />
          </div>
        </HabitInfoItemWrap>
      </div>

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
          onClick={handleCreate}
        >
          {isCreating && <SpinWaitIndicatorIcon className={styles.editNewConfirmWaitIndicator}/>}
          <span className={isCreating ? styles.editNewConfirmInProgressSpan : styles.editNewConfirmSpan}>Create</span>
        </button>
      </div>
    </div>
  )
}
