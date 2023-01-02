import {CommonMinHeight} from "./const";
import Heatmap from "../components/heatmap/heatmap";
import {useState} from "react";

enum HabitType {
  Good,
  Bad,
}

enum HabitCheckFrequency {
  Daily,
  Weekly,
}

interface HabitCardProps {
  title: string
  habitType: HabitType
  checkFrequency: string
  checkDelayHour: number
  remainRetroactiveChance: number
}

function HabitCard(props: HabitCardProps) {
  return (
    <div className={`w-full border-2 rounded-xl ${props.habitType == HabitType.Good ? "border-lime-400" : "border-amber-400"}`}>
      <h1 className="ml-4 my-1 text-2xl">{props.title}</h1>
      <div className="mx-4 my-1 h-[200px] border"></div>
      <span className="ml-4 my-1 block text-lg">{`check frequency: ${props.checkFrequency}`}</span>
      <span
        className="ml-4 my-1 block text-lg">{`check deadline: ${props.checkDelayHour == 0 ? "today 24:00" : `next day ${props.checkDelayHour}:00`}`}</span>
      <span className="ml-4 my-1 block text-lg">{`remain retroactive chance: ${props.remainRetroactiveChance}`}</span>
    </div>
  )
}


export default function Home() {
  const [habitType, setHabitType] = useState(HabitType.Good)

  return (
    <div className={`${CommonMinHeight}`}>
      <div className="w-full my-4">
        <div className="flex">
          <button
            className="w-40 ml-auto p-2 rounded-l-md bg-lime-400 text-amber-50"
            onClick={() => {
              if (habitType != HabitType.Good) {
                setHabitType(HabitType.Good)
              }
            }}
          >
            habits to form
          </button>
          <button
            className="`w-40 mr-auto p-2 rounded-r-md bg-amber-400 text-amber-50"
            onClick={() => {
              if (habitType != HabitType.Bad) {
                setHabitType(HabitType.Bad)
              }
            }}
          >
            habits to discard
          </button>
        </div>

        <ul className="w-full px-8 my-4">
          {[1, 2, 3].map((index) => {
            return (
              <li className="w-full mb-6" key={index}>
                <HabitCard
                  title="test"
                  habitType={habitType}
                  checkFrequency="daily"
                  checkDelayHour={0}
                  remainRetroactiveChance={1}/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
