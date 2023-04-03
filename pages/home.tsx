import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {EditIcon, DeleteIcon, OptionsIcon} from "../components/icons";
import {HabitIDURLParam, HabitToEdit, RoutePath} from "../util/const";
import {useDropdownHandleOutsideClick} from "../components/hooks";
import {getUserInfo} from "../api/user";
import {User} from "../util/user";
import {listHabit, logHabit} from "../api/habit";
import {DetailedHabit} from "../util/habit";
import {Pagination} from "../components/pagination";
import Heatmap from "../components/heatmap";
import {CalculatedStartDay, DateToRFC3339FormatString} from "../util/date";


interface HabitCardProps {
  habit: DetailedHabit
  startData: Date
  endDate: Date
  onEditHabit: (habit: DetailedHabit) => void
  onDeleteHabit: (habitID: number) => void
  onHabitLog: (habitID: number) => void
}


function HabitCard(props: HabitCardProps) {
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()

  // @ts-ignore
  const LogInfoCard = ({name, value}) => {
    return (
      <div className="hover:-translate-y-1 transition-transform duration-200">
        <p className="text-center w-32 h-6 font-bold text-pink-600">{value}</p>
        <div className="h-[1px] border-b border-gray-400 w-32"></div>
        <p className="text-center w-32 h-12 text-xs font-bold text-gray-400">{name}</p>
      </div>
    )
  }

  return (
    <div
      className="w-full py-8 px-16 border-1 rounded-xl bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.3)]"
    >
      <div className="my-1 flex"> {/*container for habit title options button*/}
        <h1 className="text-4xl text-gray-600">{props.habit.habit.name}</h1>
        {/*options button*/}
        <div className="ml-auto relative flex">
          <button
            className="m-auto"
            ref={btnRef}
            onClick={() => {
              setShowOptionList(!showOptionList)
            }}
          >
            <OptionsIcon className="w-2 h-10 fill-gray-500 hover:fill-black"/>
          </button>
          {showOptionList && (
            <ul
              className="absolute top-full right-1/2 rounded shadow-md bg-black text-amber-50 overflow-hidden"
              ref={optionListRef}
            >
              <li className="flex p-1.5 active:bg-gray-400 ">
                <EditIcon className="fill-amber-50 mr-1" width="20" height="20"/>
                <button onClick={() => {
                  props.onEditHabit(props.habit)
                }}>
                  edit
                </button>
              </li>
              <li className="flex p-1.5 active:bg-gray-400 ">
                <DeleteIcon className="fill-red-600 mr-1" width="20" height="20"/>
                <button className="text-red-600" onClick={() => {
                  props.onDeleteHabit(props.habit.habit.id)
                }}>
                  delete
                </button>
              </li>
            </ul>
          )}

        </div>
      </div>

      <Heatmap
        className="my-3"
        color={props.habit.user_custom_config.heatmap_color}
        data={props.habit.log_records ? props.habit.log_records.map((value) => {
          return {
            date: new Date(value.log_at),
            value: 1
          }
        }) : []}
        startDate={props.startData}
        endDate={props.endDate}
        singleColor
      />

      <div className="flex w-full">
        <div className="flex space-x-2">
          <LogInfoCard name="current streak" value={props.habit.user_custom_config.current_streak}/>
          <LogInfoCard name="longest streak" value={props.habit.user_custom_config.longest_streak}/>
          <LogInfoCard name="remain  retroactive chance"
                       value={props.habit.user_custom_config.remain_retroactive_chance}/>

        </div>
        {props.habit.today_logged ? (
          <button className="w-36 h-8 ml-auto my-auto text-white rounded-lg bg-gray-400 text-center" disabled>
            Already Logged
          </button>
        ) : (
          <button className="w-24 h-8 ml-auto my-auto text-white rounded-lg bg-pink-600" onClick={() => {
            props.onHabitLog(props.habit.habit.id)
          }}>
            Log
          </button>
        )}
      </div>
    </div>
  )
}


interface HomePageProps {
  user: User
}

export default function Home(props: HomePageProps) {
  const route = useRouter()
  const pageSize = 5
  const endDate = new Date()
  const startDate = CalculatedStartDay()

  const [page, setPage] = useState(1)
  const [habits, setHabits] = useState<DetailedHabit[]>([])
  const [totalHabitNum, setTotalHabitNum] = useState(0)

  useEffect(() => {
    if (route.isReady) {
      localStorage.setItem("user", JSON.stringify(props.user))
      listHabit(1, pageSize, DateToRFC3339FormatString(startDate), DateToRFC3339FormatString(endDate)).then((resp) => {
        setHabits(resp.data.data.habits)
        setTotalHabitNum(resp.data.data.total)
      })
    }
  }, [route.isReady])

  const toNewHabitPage = () => {
    route.push(RoutePath.NewHabitPage)
  }

  const toEditHabitPage = (habit: DetailedHabit) => {
    let query = {}
    // @ts-ignore
    query[HabitIDURLParam] = habit.habit.id
    route.push({
      pathname: RoutePath.EditHabitPage,
      query: query
    })
  }

  const doDeleteHabit = (habitID: number) => {

  }

  const doHabitLog = (habitID: number) => {
    logHabit(habitID, DateToRFC3339FormatString(new Date())).then((resp) => {
      if (resp.data && resp.data.data) {
        let newHabits = habits.map((value) => {
          if (value.habit.id == habitID) {
            value.today_logged = true
            debugger
            if (resp.data.data.log_record) {
              if (value.log_records == undefined) {
                value.log_records = [resp.data.data.log_record]
              } else {
                value.log_records.push(resp.data.data.log_record)
              }
            }
          }
          return value
        })
        setHabits(newHabits)
      }
    })
  }

  return (
    <div className="w-full py-4 px-52 space-y-8">
      <div className="flex">
        <button
          className="h-10 p-2 ml-auto rounded-md bg-black text-amber-50 shadow-[0px_3px_gray] active:translate-y-[3px] active:shadow-none"
          onClick={toNewHabitPage}
        >
          New Habit
        </button>
      </div>

      {/*habit table*/}
      <ul className="my-6">
        {habits.map((value, index) => {
          return (
            <li className="mb-8" key={index}>
              <HabitCard
                habit={value}
                startData={startDate}
                endDate={endDate}
                onEditHabit={toEditHabitPage}
                onDeleteHabit={doDeleteHabit}
                onHabitLog={doHabitLog}
              />
            </li>
          )
        })}
      </ul>
      <span className="block text-right text-gray-500">
        <span className="text-red-500">*</span> notice: all habits&apos; log deadline is next day 4:00 AM
      </span>
      <div className="w-full flex">
        <div className="m-auto">
          <Pagination
            currentPage={page}
            totalPage={Math.ceil(totalHabitNum / pageSize)}
            toPreviousPage={() => {
              if (page > 2) {
                setPage(page - 1)
              }
            }}
            toNextPage={() => {
              if (page < Math.ceil(totalHabitNum / pageSize)) {
                setPage(page + 1)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: object) {
  // @ts-ignore
  return await getUserInfo(context.req.headers.cookie).then((resp) => {
    if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
      return {
        redirect: {
          destination: RoutePath.EmailActivateSendPage,
          permanent: false,
        }
      }
    }
    return {
      props: {
        user: resp.data.data.user
      }
    }
  }).catch(() => {
    return {
      redirect: {
        destination: RoutePath.LoginPage,
        permanent: false,
      }
    }
  })
}
