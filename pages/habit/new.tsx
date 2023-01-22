import Select from "../../components/select";
import {UserSearcher} from "../../components/search";


export default function NewHabitPage() {
  const innerSpacing = "space-y-1"
  const spanTextClass = "text-gray-400"
  const commonBlurRing = "ring-inset ring-2 ring-gray-200"
  const commonFocusRing = "focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"

  const selectCommonClass = `min-h-[44px] rounded-lg text-slate-600 ${commonBlurRing} ${commonFocusRing}`
  const selectItemCommonClass = "p-2 h-[44px]"

  const textInputClass = `w-full h-[44px] rounded-lg border-transparent bg-transparent ${commonBlurRing} ${commonFocusRing}`

  return (
    <div className="w-full px-8 py-6">
      <div className="m-auto space-y-6">
        <div className={innerSpacing}>
          <span className={spanTextClass}>Habit Name</span>
          <input type="text" className={textInputClass}/>
        </div>
        <div className={innerSpacing}>
          <span className={spanTextClass}>Habit Type</span>
          <Select
            className="w-full"
            buttonClassName={selectCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["Habit To From", "Habit To Discard"]}
            defaultValue="Habit To From"
          />
        </div>
        <div className={innerSpacing}>
          <span className={spanTextClass}>Check Frequency</span>
          <Select
            className="w-full"
            buttonClassName={selectCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["Daily", "Weekly", "Monthly"]}
            defaultValue="Daily"
          />
        </div>
        <div className={innerSpacing}>
          <span className={spanTextClass}>Delay Time</span>
          <Select
            className="w-full"
            buttonClassName={selectCommonClass}
            optionListItemViewClassName={selectItemCommonClass}
            options={["No Delay", "Next Day 4:00 AM"]}
            defaultValue="No Delay"
          />
        </div>
        <div className={innerSpacing}>
          <span className={spanTextClass}>Identity To From</span>
          <input type="text" className={textInputClass}/>
        </div>
        <div className={innerSpacing}>
          <span className={spanTextClass}>Friends To Invite</span>
          <UserSearcher
            className={`w-full ${commonBlurRing} focus-within:ring-inset focus-within:ring-2 focus-within:ring-gray-400`}
            inputClassName={`border-transparent bg-transparent focus:outline-none focus:border-transparent focus:ring-0`}
          />
        </div>
      </div>
    </div>
  )
}
