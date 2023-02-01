import Select from "../../components/select";
import {UserSearcher} from "../../components/search";
import {ReactNode} from "react";

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

export default function NewHabitPage() {

  const commonBlurRing = "ring-inset ring-2 ring-gray-200"
  const commonFocusRing = "focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"

  const selectBtnCommonClass = `h-[44px] rounded-lg text-slate-600 ${commonBlurRing} ${commonFocusRing}`
  const selectItemCommonClass = "p-2 h-[44px]"

  const textInputClass = `w-full h-[44px] rounded-lg border-transparent bg-transparent ${commonBlurRing} ${commonFocusRing}`

  return (
    <div className="w-full px-8 py-6">
      <div className="m-auto space-y-6">
        <HabitInfoItemWrap name="Habit Name">
          <input type="text" className={textInputClass}/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Identity To From">
          <input type="text" className={textInputClass}/>
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Friends To Invite">
          <UserSearcher
            className={`w-full h-[44px] rounded-lg ${commonBlurRing} focus-within:ring-inset focus-within:ring-2 focus-within:ring-gray-400`}
            inputClassName={`border-transparent bg-transparent focus:outline-none focus:border-transparent focus:ring-0`}
            resultContainerClassName=""
            resultItemClassName=""
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Habit Type">
          <Select
            className="w-full"
            buttonClassName={selectBtnCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["Habit To From", "Habit To Discard"]}
            defaultValue="Habit To From"
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Check Frequency">
          <Select
            className="w-full"
            buttonClassName={selectBtnCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["Daily", "Weekly", "Monthly"]}
            defaultValue="Daily"
          />
        </HabitInfoItemWrap>
        <HabitInfoItemWrap name="Delay Time">
          <Select
            className="w-full"
            buttonClassName={selectBtnCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["No Delay", "Next Day 4:00 AM"]}
            defaultValue="No Delay"
          />
        </HabitInfoItemWrap>
      </div>
    </div>
  )
}
