import styles from './edit_new.module.css'
import React, {useEffect, useRef, useState} from "react";
import {DetailedHabit} from "../../util/habit";
import {HabitIDURLParam, RoutePath} from "../../util/const";
import {UserSearcher} from "../../components/search";
import {WeekdayChooser} from "../../components/weekday_chooser";
import Heatmap from "../../components/heatmap";
import {CalculatedStartDay} from "../../util/date";
import {useRouter} from "next/router";
import {HabitInfoItemWrap} from "../../components/habit_new_edit_shared";
import {GetLocalUserInfo, SimplifiedUser} from "../../util/user";
import {
  getHabit,
  updateHabit,
  UpdateHabitCustomConfigReq,
  UpdateHabitReq
} from "../../api/habit";
import {noti} from "../../util/noti";
import {SpinWaitIndicatorIcon} from "../../components/icons";
import {GetServerSideProps} from "next";

interface EditHabitPageProps {
  habit: DetailedHabit | null
}

export default function EditHabitPage(props: EditHabitPageProps) {
  const route = useRouter()

  const [habit, setHabit] = useState<DetailedHabit | null>(null)
  const [curUser, setCurUser] = useState<SimplifiedUser | null>(null)
  const [habitName, setHabitName] = useState("")
  const [identity, setIdentity] = useState("")
  const [cooperators, setCooperators] = useState<SimplifiedUser[]>([])
  const [heatmapColor, setHeatmapColor] = useState("#D3D3D3")
  const [isHabitOwner, setIsHabitOwner] = useState(false)

  const [isUpdating, setIsUpdating] = useState(false)
  const colorPickerRef = useRef(null)

  let heatmapEndDate = new Date()
  let heatmapStartDate = CalculatedStartDay()

  useEffect(() => {
    let habitInfo = props.habit
    if (habitInfo) {
      let userInfo = GetLocalUserInfo()
      setHabit(habitInfo)
      setHabitName(habitInfo.habit.name)
      setIdentity(habitInfo.habit.identity ? habitInfo.habit.identity : "")
      setCooperators(habitInfo.cooperators)
      setHeatmapColor(habitInfo.user_custom_config.heatmap_color)
      if (userInfo) {
        setCurUser(userInfo)
        if (habitInfo.habit.owner == userInfo.uid) {
          setIsHabitOwner(true)
        }
      }
      if (colorPickerRef.current) {
        // @ts-ignore
        colorPickerRef.current.value = habitInfo.user_custom_config.heatmap_color
      }
    }
  }, [])

  const handleUpdate = () => {
    if (habit) {
      let newHabit = JSON.parse(JSON.stringify(habit))
      let basicInfo: UpdateHabitReq = {
        name: null,
        identity: null,
        cooperators_to_add: null,
        cooperators_to_delete: null
      }
      let customInfo: UpdateHabitCustomConfigReq = {
        heatmap_color: null
      }

      let hasCustomInfoUpdated = false
      if (heatmapColor != habit.user_custom_config.heatmap_color) {
        customInfo.heatmap_color = heatmapColor
        newHabit.user_custom_config.heatmap_color = heatmapColor as string
        hasCustomInfoUpdated = true
      }

      let hasBasicInfoUpdated = false
      if (habitName != habit.habit.name) {
        basicInfo.name = habitName
        newHabit.habit.name = habitName
        hasBasicInfoUpdated = true
      }

      if (identity != habit.habit.identity) {
        basicInfo.identity = identity
        newHabit.habit.identity = identity
        hasBasicInfoUpdated = true
      }

      // get cooperators to add
      let cooperatorToAdd = []
      if (habit.cooperators.length == 0) {
        cooperatorToAdd = cooperators.map((value) => {
          return value.uid
        })
      } else {
        for (let c of cooperators) {
          if (habit.cooperators.findIndex((value) => {
            return value.uid == c.uid
          }) == -1) {
            cooperatorToAdd.push(c.uid)
          }
        }
      }
      if (cooperatorToAdd.length > 0) {
        basicInfo.cooperators_to_add = cooperatorToAdd
        hasBasicInfoUpdated = true
      }

      // get cooperators to delete
      let cooperatorToDelete = []
      if (habit.cooperators.length > 0) {
        for (let c of habit.cooperators) {
          if (cooperators.findIndex((value) => {
            return value.uid == c.uid
          }) == -1) {
            cooperatorToDelete.push(c.uid)
          }
        }
      }
      if (cooperatorToDelete.length > 0) {
        basicInfo.cooperators_to_delete = cooperatorToDelete
        hasBasicInfoUpdated = true
      }
      newHabit.cooperators = cooperators
      if (hasBasicInfoUpdated || hasCustomInfoUpdated) {
        setIsUpdating(true)
        updateHabit(habit.habit.id, basicInfo, customInfo).then(() => {
          setHabit(newHabit)
          noti.success("update done")
        }).finally(() => {
          setTimeout(() => {
            setIsUpdating(false)
          }, 1000)
        })
      } else {
        noti.warning("no field has updated")
      }
    }
  }

  if (!props.habit) {
    return (
      <div className="m-auto flex flex-col justify-center items-center">
        <div className="text-5xl">404</div>
        <div>wops, no habit found !!!</div>
      </div>
    )
  }

  return (
    <div className={styles.editNewOutsideContainer}>
      {/*form*/}
      <div className={styles.editNewForm}>
        <HabitInfoItemWrap name="Habit Name">
          <input
            type="text"
            className={styles.editNewTextInput}
            defaultValue={habitName}
            onChange={(e) => {
              setHabitName(e.target.value)
            }}
            disabled={!isHabitOwner}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Identity To From">
          <input
            type="text"
            className={styles.editNewTextInput}
            defaultValue={identity}
            onChange={(e) => {
              setIdentity(e.target.value)
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
            defaultUsers={cooperators}
            onSelectUserChange={(users) => {
              setCooperators(users)
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
            <div className={styles.editNewColorPickerContainer} style={{backgroundColor: heatmapColor}}>
              <input
                id="heatmap-color-picker"
                className="opacity-0"
                type="color"
                onChange={(e) => {
                  setHeatmapColor(e.target.value)
                }}
                ref={colorPickerRef}
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

        {/*cancel & commit btn*/}
        <div className={styles.editNewBtnContainer}>
          <button
            className={styles.editNewCancelBtn}
            onClick={() => route.back()}
          >
            Cancel
          </button>
          <button
            className={isUpdating ? styles.editNewConfirmInProgressBtn : styles.editNewConfirmBtn}
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating && <SpinWaitIndicatorIcon className={styles.editNewConfirmWaitIndicator}/>}
            <span
              className={isUpdating ? styles.editNewConfirmInProgressSpan : styles.editNewConfirmSpan}>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return await getHabit(parseInt(context.query[HabitIDURLParam] as string, 10), context.req.headers.cookie).then((resp) => {
    return {
      props: {
        habit: resp.data.data.habit
      }
    }
  }).catch(({isAuthFail}) => {
    if (isAuthFail) {
      return {
        redirect: {
          destination: RoutePath.LoginPage,
          permanent: false,
        }
      }
    }
    return {
      props: {
        habit: null
      }
    }
  })
}
