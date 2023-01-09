import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {useRouter} from "next/router";
import {EditIcon, DeleteIcon} from "../components/icons/icons";
import {HabitIDURLParam, UserTokenHeader} from "../util/const";

enum HabitType {
  Good,
  Bad,
}

enum HabitCheckFrequency {
  Daily,
  Weekly,
}

interface HabitCardProps {
  habitID: string
  title: string
  habitType: HabitType
  checkFrequency: string
  checkDelayHour: number
  remainRetroactiveChance: number

  onEditHabit: (habitID: string) => void
  onDeleteHabit: (habitID: string) => void
}

const defaultSelectedHabit = {habitID: ""}
const selectedHabitContext = createContext({
  selectedHabitInfo: defaultSelectedHabit,
  dispatch(param: { payload: string; type: string }) {
  }
})
const SELECT_HABIT_ACT = "habit/select"

function reducer(state: { habitID: string }, action: { type: string, payload: string }) {
  switch (action.type) {
    case SELECT_HABIT_ACT:
      return {habitID: action.payload}
    default:
      throw new Error(`unsupported action: ${action.type}`)
  }
}

function HabitCard(props: HabitCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  const selectedHabitCtx = useContext(selectedHabitContext)

  return (
    <div
      className={`w-full border-1 rounded-xl shadow-[0px_0px_15px_rgba(0,0,0,0.3)]`}
    >
      <div className="ml-4 my-1 flex"> {/*container for habit title options button*/}
        <h1 className="text-4xl">{props.title}</h1>
        {/*options button*/}
        <div className="ml-auto relative flex">
          <button className="m-auto"
                  onClick={() => {
                    if (selectedHabitCtx.selectedHabitInfo.habitID != props.habitID) {
                      selectedHabitCtx.dispatch({type: SELECT_HABIT_ACT, payload: props.habitID})
                      setShowOptions(true)
                    } else {
                      setShowOptions(!showOptions)
                    }
                  }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="32"
              height="32"
              className="fill-gray-500 hover:fill-black"
            >
              <circle cx="50%" cy="8" r="3"/>
              <circle cx="50%" cy="16" r="3"/>
              <circle cx="50%" cy="24" r="3"/>
            </svg>
          </button>
          {selectedHabitCtx.selectedHabitInfo.habitID == props.habitID && showOptions && (
            <ul className="absolute top-full right-4 rounded shadow-md bg-black text-amber-50">
              <li className="flex p-1.5 active:bg-gray-400 ">
                <EditIcon className="fill-amber-50 mr-1" width="20" height="20"/>
                <button onClick={() => {
                  props.onEditHabit(props.habitID)
                }}>
                  edit
                </button>
              </li>
              <li className="flex p-1.5 active:bg-gray-400 ">
                <DeleteIcon className="fill-red-600 mr-1" width="20" height="20"/>
                <button className="text-red-600" onClick={() => {
                  props.onDeleteHabit(props.habitID)
                }}>
                  delete
                </button>
              </li>
            </ul>
          )}

        </div>
      </div>
      {/*TODO: replace with calender heatmap*/}
      <div className="mx-4 my-1 h-[200px] border"/>

      <span className="ml-4 my-1 block text-lg">{`check frequency: ${props.checkFrequency}`}</span>
      <span
        className="ml-4 my-1 block text-lg">{`check deadline: ${props.checkDelayHour == 0 ? "today 24:00" : `next day ${props.checkDelayHour}:00`}`}</span>
      <span className="ml-4 my-1 block text-lg">{`remain retroactive chance: ${props.remainRetroactiveChance}`}</span>
      <button
        className="ml-4 my-1"
        onClick={() => {
          //TODO: handle check habit
        }}
      >
        check
      </button>
    </div>
  )
}


export default function Home() {
  const [habitType, setHabitType] = useState(HabitType.Good)
  const [selectedHabitInfo, dispatch] = useReducer(reducer, defaultSelectedHabit)
  const route = useRouter()

  useEffect(()=> {
    if (localStorage.getItem(UserTokenHeader) == null) { // TODO: replace with get habit list
      route.replace("/login")
    }
  })

  const toNewHabitPage = () => {
    route.push("/habit/new")
  }

  const toEditHabitPage = (habitID: string) => {
    let query = {}
    // @ts-ignore
    query[HabitIDURLParam] = habitID
    route.push("/habit/edit", {
      query: query
    })
  }

  const doDeleteHabit = (habitID: string) => {

  }

  return (
    <div className="my-4">
      <div className="flex"> {/*top button container*/}
        {/*habits to form button*/}
        <button
          className={`w-40 ml-auto p-2 rounded-l-md bg-slate-600 text-amber-50 ${habitType == HabitType.Good ? "translate-y-[3px] shadow-[inset_0px_2px_black]" : "hover:bg-slate-700 shadow-[0px_3px_black]"}`}
          onClick={() => {
            if (habitType != HabitType.Good) {
              setHabitType(HabitType.Good)
            }
          }}
        >
          Habits to form
        </button>
        {/*habits to discard button*/}
        <button
          className={`w-40 mr-auto p-2 rounded-r-md bg-yellow-500 text-amber-50 ${habitType == HabitType.Bad ? "translate-y-[3px] shadow-[inset_0px_2px_black]" : "hover:bg-yellow-600 shadow-[0px_3px_black]"}`}
          onClick={() => {
            if (habitType != HabitType.Bad) {
              setHabitType(HabitType.Bad)
            }
          }}
        >
          Habits to discard
        </button>
        {/*new habit button*/}
        <button
          className="flex h-10 p-2 absolute right-8 rounded-md bg-slate-800 text-amber-50 shadow-[0px_3px_gray] active:translate-y-[3px] active:shadow-none"
          onClick={toNewHabitPage}
        >
          New Habit
        </button>
      </div>

      {/*habit table*/}
      <selectedHabitContext.Provider value={{selectedHabitInfo, dispatch}}>
        <ul className="px-8 my-6">
          {[1, 2, 3].map((index) => {
            return (
              <li className="mb-8" key={index}>
                <HabitCard
                  habitID={index.toString()}
                  title="test"
                  habitType={habitType}
                  checkFrequency="daily"
                  checkDelayHour={0}
                  remainRetroactiveChance={1}
                  onEditHabit={toEditHabitPage}
                  onDeleteHabit={doDeleteHabit}
                />
              </li>
            )
          })}
        </ul>
      </selectedHabitContext.Provider>
    </div>
  )
}
