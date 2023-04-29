import React, {useState} from "react";
import {Weekday} from "../util/habit";
import {CheckBox} from "./checkbox";

interface WeekdayChooserProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  defaultChooseDays?: Weekday
  disabled?: boolean
  onChooseChange?: (v: number) => void
}


export function WeekdayChooser(props: WeekdayChooserProps) {
  const {defaultChooseDays, disabled, onChooseChange, className, ...otherProps} = props

  const spanClass = "ml-2 text-gray-400"
  const checkboxClass = "my-auto border-[#ff8c00]"
  const checkboxCheckedClass = "bg-[#ff8c00]"
  const [chosenDays, setChosenDays] = useState(defaultChooseDays ? defaultChooseDays : Weekday.All)

  const handleCheck = (day: Weekday) => {
    return () => {
      let newCheckedDays = chosenDays ^ day
      setChosenDays(newCheckedDays)
      if (onChooseChange) {
        onChooseChange(newCheckedDays)
      }
    }
  }

  return (
    <div {...otherProps} className={`${className} ${disabled ? "pointer-events-none": ""}`}>
      <div className="space-y-1">
        <div className="flex">
          <CheckBox id="logForSunday" checked={(chosenDays & Weekday.Sunday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Sunday)}
          />
          <span className={spanClass}>Sunday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForMonday" checked={(chosenDays & Weekday.Monday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Monday)}
          />
          <span className={spanClass}>Monday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForTuesday" checked={(chosenDays & Weekday.Tuesday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Tuesday)}
          />
          <span className={spanClass}>Tuesday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForWednesday" checked={(chosenDays & Weekday.Wednesday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Wednesday)}
          />
          <span className={spanClass}>Wednesday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForThursday" checked={(chosenDays & Weekday.Thursday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Thursday)}
          />
          <span className={spanClass}>Thursday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForFriday" checked={(chosenDays & Weekday.Friday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Friday)}
          />
          <span className={spanClass}>Friday</span>
        </div>
        <div className="flex">
          <CheckBox id="logForSaturday" checked={(chosenDays & Weekday.Saturday) > 0} className={checkboxClass}
                    checkedClassName={checkboxCheckedClass} onChange={handleCheck(Weekday.Saturday)}
          />
          <span className={spanClass}>Saturday</span>
        </div>
      </div>
    </div>
  )
}
