import {FullFlexContainerClass} from "../../util/const";
import Select from "../../components/select";


export default function NewHabitPage() {
  const nameInputSpacing = "space-y-1"
  const spanTextClass = "text-gray-400"
  const commonBlurRing = "ring-2 ring-gray-200"
  const focusRingColor = "focus:ring-2 focus:ring-gray-400"
  const inputFocusClear = "focus:outline-none focus:border-transparent"

  const selectCommonClass = `w-full h-[42px] p-2 rounded-lg text-slate-600 ${commonBlurRing} ${focusRingColor}`
  const selectItemCommonClass = "px-2 h-[42px]"

  return (
    <div className={FullFlexContainerClass}>
      <div className="w-full px-10 py-6">
        <div className="m-auto space-y-6">
          <div className={nameInputSpacing}>
            <span className={spanTextClass}>Habit Name</span>
            <input
              type="text"
              className={`w-full rounded-lg border-transparent bg-transparent ${commonBlurRing} ${inputFocusClear} ${focusRingColor}`}
            />
          </div>
          <div className={nameInputSpacing}>
            <span className={spanTextClass}>Habit Type</span>
            <Select
              className={selectCommonClass}
              optionListItemViewClassName={selectItemCommonClass}
              options={["Habit To From", "Habit To Discard"]}
              defaultValue="Habit To From"
            />
          </div>
          <div className={nameInputSpacing}>
            <span className={spanTextClass}>Check Frequency</span>
            <Select
              className={selectCommonClass}
              optionListItemViewClassName={selectItemCommonClass}
              options={["Every Day", "Once A Week"]}
              defaultValue="Every Day"
            />
          </div>
          <div className={nameInputSpacing}>
            <span className={spanTextClass}>Delay Time</span>
            <Select
              className={selectCommonClass}
              optionListItemViewClassName={selectItemCommonClass}
              options={["No Delay", "Next Day 4:00 AM"]}
              defaultValue="No Delay"
            />
          </div>
        </div>
      </div>

    </div>
  )
}
