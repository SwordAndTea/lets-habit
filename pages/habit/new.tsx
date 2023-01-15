import {FullFlexContainerClass} from "../../util/const";
import Select from "../../components/select";


export default function NewHabitPage() {
  const spanTextClass = "text-gray-400"

  return (
    <div className={FullFlexContainerClass}>
      <div className="w-full px-10 py-6">
        <form className="m-auto space-y-6">
          <div className="space-y-1">
            <span className={spanTextClass}>Habit Name</span>
            <input type="text" className="w-full rounded-lg border-2 border-gray-200 bg-transparent focus:outline-none focus:border-transparent focus:ring-2 focus:ring-gray-400"></input>
          </div>
          <div className="space-y-1">
            <span className={spanTextClass}>Habit Type</span>
            <Select
              className="w-full border-2 h-[40px] rounded-lg text-gray-400 focus:border-gray-400"
              type="button"
              options={["Habit To From", "Habit To Discard"]}
              defaultValue="Habit To From"
            />
          </div>
        </form>
      </div>

    </div>
  )
}
