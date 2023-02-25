import {UserSearcher} from "../../components/search";
import React, {ReactNode, useState} from "react";
import {useRouter} from "next/router";
import {SpinWaitIndicatorIcon} from "../../components/icons";
import {CheckBox} from "../../components/checkbox";
import Heatmap from "../../components/heatmap";
import {SimplifiedUser} from "../../util/user";
import {createHabit} from "../../api/habit";

interface HabitInfoItemWrapProps {
  name: string
  children: ReactNode
}

function HabitInfoItemWrap(props: HabitInfoItemWrapProps) {
  return (
    <div className="space-y-1">
      <span className="text-gray-400">{props.name}</span>
      {props.children}
    </div>
  )
}

interface CheckDayChooserProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onChooseChange?: (v: number) => void
}

enum Weekday {
  Monday = 1 << 0,
  Tuesday = 1 << 1,
  Wednesday = 1 << 2,
  Thursday = 1 << 3,
  Friday = 1 << 4,
  Saturday = 1 << 5,
  Sunday = 1 << 6,
  All = Weekday.Monday | Weekday.Tuesday | Weekday.Wednesday | Weekday.Thursday | Weekday.Friday | Weekday.Saturday | Weekday.Sunday
}

function CheckDayChooser(props: CheckDayChooserProps) {
  const {onChooseChange, ...otherProps} = props

  const spanClass = "ml-2 text-gray-400"
  const checkboxClass = "my-auto border-[#ff8c00]"
  const checkboxCheckedClass = "bg-[#ff8c00]"
  const [checkedDays, setCheckedDays] = useState(Weekday.All)

  const handleCheck = (day: Weekday) => {
    return () => {
      let newCheckedDays = checkedDays ^ day
      setCheckedDays(newCheckedDays)
      if (onChooseChange) {
        onChooseChange(newCheckedDays)
      }
    }
  }

  return (
    <div {...otherProps}>
      <div className="space-y-1">
        <div className="flex">
          <CheckBox id="checkForMonday" checked={(checkedDays & Weekday.Monday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Monday)}
          />
          <span className={spanClass}>Monday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForTuesday" checked={(checkedDays & Weekday.Tuesday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Tuesday)}
          />
          <span className={spanClass}>Tuesday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForWednesday" checked={(checkedDays & Weekday.Wednesday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Wednesday)}
          />
          <span className={spanClass}>Wednesday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForThursday" checked={(checkedDays & Weekday.Thursday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Thursday)}
          />
          <span className={spanClass}>Thursday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForFriday" checked={(checkedDays & Weekday.Friday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Friday)}
          />
          <span className={spanClass}>Friday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForSaturday" checked={(checkedDays & Weekday.Saturday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Saturday)}
          />
          <span className={spanClass}>Saturday</span>
        </div>
        <div className="flex">
          <CheckBox id="checkForSunday" checked={(checkedDays & Weekday.Sunday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Sunday)}
          />
          <span className={spanClass}>Sunday</span>
        </div>
      </div>
    </div>
  )
}

export default function NewHabitPage() {
  const route = useRouter()

  const commonBlurRing = "ring-inset ring-2 ring-gray-200"
  const commonFocusRing = "focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"

  const selectBtnCommonClass = `h-[44px] rounded-lg text-slate-600 ${commonBlurRing} ${commonFocusRing}`
  const selectItemCommonClass = "p-2 h-[44px]"

  const textInputClass = `w-full h-[44px] rounded-lg border-transparent bg-transparent ${commonBlurRing} ${commonFocusRing}`

  const [isCreating, setIsCreating] = useState(false)
  const [habitName, setHabitName] = useState("")
  const [identity, setIdentity] = useState("")
  const [cooperators, setCooperators] = useState<SimplifiedUser[]>([])
  const [checkDays, setCheckDays] = useState(Weekday.All)
  const defaultHeatmapColor = "#f5317f"
  const [heatmapColor, setHeatmapColor] = useState(defaultHeatmapColor)

  let heatmapEndDate = new Date()
  let heatmapStartDate = new Date()
  heatmapStartDate.setDate(heatmapEndDate.getDate() - 365)
  const millisecondsADay = 24 * 60 * 60 * 1000
  const currentTime = heatmapEndDate.getTime()

  let heatmapData = [
    {
      date: new Date(currentTime - millisecondsADay * 106),
      value: 1,
    },
    {
      date: new Date(currentTime - millisecondsADay * 105),
      value: 1,
    },
    {
      date: new Date(currentTime - millisecondsADay * 104),
      value: 1
    },
    {
      date: new Date(currentTime - millisecondsADay * 100),
      value: 1
    },
    {
      date: new Date(currentTime - millisecondsADay * 99),
      value: 1
    },
    {
      date: new Date(currentTime - millisecondsADay * 98),
      value: 1
    },
    {
      date: new Date(currentTime - millisecondsADay * 97),
      value: 1
    }
  ]


  const handleCreate = () => {
    setIsCreating(true)
    let cooperatorIDs = cooperators.map((value) => {
      return value.uid
    })
    let createHabitReq = {
      name: habitName,
      identity: identity ? identity : null,
      cooperators: cooperatorIDs,
      check_days: checkDays,
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
    <div className="relative w-full px-36 py-6">
      {/*creating waiting mask and indicator*/}
      {isCreating && (
        <div className="absolute z-50 top-0 right-0 bottom-0 left-0 flex bg-gray-400/25">
          <SpinWaitIndicatorIcon className="m-auto w-10 h-10"/>
        </div>
      )}
      {/*form*/}
      <div className="w-full space-y-6">
        <HabitInfoItemWrap name="Habit Name">
          <input type="text" className={textInputClass} onChange={(e) => {
            setHabitName(e.target.value)
          }}/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Identity To From">
          <input type="text" className={textInputClass} onChange={(e) => {
            setIdentity(e.target.value)
          }
          }/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Friends To Invite">
          <UserSearcher
            className={`w-full min-h-[44px] rounded-lg ${commonBlurRing} focus-within:ring-inset focus-within:ring-2 focus-within:ring-gray-400`}
            inputClassName={`border-transparent bg-transparent focus:outline-none focus:border-transparent focus:ring-0`}
            resultContainerClassName=""
            resultItemClassName=""
            onSelectUserChange={(users) => {
              setCooperators(users)
            }}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Check Days">
          <CheckDayChooser className={`w-full rounded-lg p-2 ${commonBlurRing}`} onChooseChange={(v) => {
            setCheckDays(v)
          }}
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Heatmap Customization">
          <div className={`rounded-lg p-4 ${commonBlurRing}`}>
            <input className="mb-4" type="color" defaultValue={defaultHeatmapColor} onChange={(e) => {
              setHeatmapColor(e.target.value)
            }}/>
            <Heatmap color={heatmapColor} startDate={heatmapStartDate} endDate={heatmapEndDate} data={heatmapData}
                     singleColor/>
          </div>
        </HabitInfoItemWrap>
      </div>

      {/*cancel & commit btn*/}
      <div className="flex mt-6">
        <button
          className="ml-auto bg-gray-300 text-rose-500 w-24 h-10 rounded-lg"
          onClick={() => route.back()}
        >
          Cancel
        </button>
        <button
          className="ml-4 bg-black text-white w-24 h-10 rounded-lg"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  )
}
