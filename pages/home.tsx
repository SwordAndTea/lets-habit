import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {EditIcon, DeleteIcon} from "../components/icons";
import {HabitIDURLParam, RoutePath, UserTokenHeader} from "../util/const";
import {useDropdownHandleOutsideClick} from "../components/hooks";
import {getUserInfo} from "../api/user";
import {HandleUserResp} from "../util/user";
import {listHabit} from "../api/habit";
import {noti} from "../util/noti";
import {DetailedHabit} from "../util/habit";
import {Pagination} from "../components/pagination";
import Heatmap from "../components/heatmap";


interface HabitCardProps {
  habit: DetailedHabit
  onEditHabit: (habitID: number) => void
  onDeleteHabit: (habitID: number) => void
}


function HabitCard(props: HabitCardProps) {
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()
  let endDate = new Date()
  let startDate = new Date()
  startDate.setDate(endDate.getDate() - 365)

  return (
    <div
      className="w-full border-1 rounded-xl bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.3)]"
    >
      <div className="ml-4 my-1 flex"> {/*container for habit title options button*/}
        <h1 className="text-4xl">{props.habit.habit.name}</h1>
        {/*options button*/}
        <div className="ml-auto relative flex">
          <button
            className="m-auto"
            ref={btnRef}
            onClick={() => {
              setShowOptionList(!showOptionList)
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
          {showOptionList && (
            <ul
              className="absolute top-full right-1/2 rounded shadow-md bg-black text-amber-50"
              ref={optionListRef}
            >
              <li className="flex p-1.5 active:bg-gray-400 ">
                <EditIcon className="fill-amber-50 mr-1" width="20" height="20"/>
                <button onClick={() => {
                  props.onEditHabit(props.habit.habit.id)
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
      {/*TODO: replace with heatmap*/}
      <Heatmap
        className="mx-8 my-3"
        color={props.habit.user_custom_config.heatmap_color}
        data={props.habit.check_records ? props.habit.check_records.map((value) => {
          return {
            date: new Date(value.check_at),
            value: 1
          }
        }) : []}
        startDate={startDate}
        endDate={endDate}
        singleColor
      />

      {/*<span className="ml-4 my-1 block text-lg">{`check frequency: ${props.checkFrequency}`}</span>*/}
      <span
        className="ml-4 my-1 block text-lg">{`check deadline: ${props.habit.habit.check_deadline_delay == 0 ? "today 24:00" : `next day ${props.habit.habit.check_deadline_delay}:00`}`}</span>
      <span
        className="ml-4 my-1 block text-lg">{`remain retroactive chance: ${props.habit.user_custom_config.remain_recheck_chance}`}</span>
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
  const route = useRouter()
  const pageSize = 5

  const [page, setPage] = useState(1)
  const [habits, setHabits] = useState<DetailedHabit[]>([])
  const [totalHabitNum, setTotalHabitNum] = useState(0)

  useEffect(() => {
    if (localStorage.getItem(UserTokenHeader) == null) {
      route.replace(RoutePath.LoginPage)
    }
    getUserInfo().then((resp) => {
      HandleUserResp(resp, route)
      listHabit(1, pageSize).then((resp) => {
        if (resp.data && resp.data.data && resp.data.data.habits && resp.data.data.total) {
          setHabits(resp.data.data.habits)
          setTotalHabitNum(resp.data.data.total)
        } else {
          noti.error("cannot parse get habits response")
        }
      })
    }).catch(({isAuthFail}) => {
      if (isAuthFail) {
        route.replace(RoutePath.LoginPage)
      }
    })
  }, [])

  const toNewHabitPage = () => {
    route.push(RoutePath.NewHabitPage)
  }

  const toEditHabitPage = (habitID: number) => {
    let query = {}
    // @ts-ignore
    query[HabitIDURLParam] = habitID
    route.push(RoutePath.EditHabitPage, {
      query: query
    })
  }

  const doDeleteHabit = (habitID: number) => {

  }

  return (
    <div className="w-full py-4 px-28 space-y-6">
      <div className="flex">
        <button
          className="h-10 p-2 ml-auto rounded-md bg-pink-400 text-amber-50 shadow-[0px_3px_gray] active:translate-y-[3px] active:shadow-none"
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
                onEditHabit={toEditHabitPage}
                onDeleteHabit={doDeleteHabit}
              />
            </li>
          )
        })}
      </ul>
      <span className="block text-right text-gray-500">
        <span className="text-red-500">*</span> notice: all habits&apos; check deadline is next day 4:00 AM after the check day
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
