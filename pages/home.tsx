import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {EditIcon, DeleteIcon, OptionsIcon, SpinWaitIndicatorIcon} from "../components/icons";
import {HabitIDURLParam, RoutePath} from "../util/const";
import {useDropdownHandleOutsideClick} from "../components/hooks";
import {CommonServerGetSideUserProp, PageUserProp, setUserStore} from "../util/user";
import {deleteHabit, listHabit, logHabit} from "../api/habit";
import {DetailedHabit} from "../util/habit";
import {Pagination} from "../components/pagination";
import Heatmap from "../components/heatmap";
import {CalculatedStartDay, DateToRFC3339FormatString} from "../util/date";
import {AvatarList} from "../components/avatar_list";
import {Modal} from "../components/modal";
import {noti} from "../util/noti";


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
      className="w-full py-8 px-16 rounded-xl bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.3)]"
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

      <AvatarList users={props.habit.cooperators}
                  logStatus={new Map(Object.entries(props.habit.cooperator_log_status))}/>

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

export default function Home(props: PageUserProp) {
  const route = useRouter()
  const pageSize = 5
  const endDate = new Date()
  const startDate = CalculatedStartDay()

  const [isFetchingHabit, setIsFetchingHabit] = useState(false)
  const [page, setPage] = useState(1)
  const [habits, setHabits] = useState<DetailedHabit[]>([])
  const [totalHabitNum, setTotalHabitNum] = useState(0)
  const [showModel, setShowModal] = useState(false)
  const [deletingHabitID, setDeletingHabitID] = useState(-1)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setUserStore(props.user)
    doFetchHabit()
  }, [])

  const doFetchHabit = () => {
    setIsFetchingHabit(true)
    listHabit(page, pageSize, DateToRFC3339FormatString(startDate), DateToRFC3339FormatString(endDate)).then((resp) => {
      setHabits(resp.data.data.habits)
      setTotalHabitNum(resp.data.data.total)
      setTimeout(() => {
        setIsFetchingHabit(false)
      }, 200)
    })
  }

  const toNewHabitPage = () => {
    route.push(RoutePath.NewHabitPage)
  }

  const toEditHabitPage = (habit: DetailedHabit) => {
    route.push({
      pathname: RoutePath.EditHabitPage,
      query: {
        [HabitIDURLParam]: habit.habit.id
      }
    })
  }

  // handleDeleteClicked, present confirm delete modal

  const doDeleteHabit = (habitID: number) => {
    setIsDeleting(true)
    deleteHabit(habitID).then(() => {
      noti.success("deleted")
      doFetchHabit()
    }).finally(() => {
      setIsDeleting(false)
      setShowModal(false)
    })
  }

  const doHabitLog = (habitID: number) => {
    logHabit(habitID, DateToRFC3339FormatString(new Date())).then((resp) => {
      if (resp.data && resp.data.data) {
        let newHabits = habits.map((value) => {
          if (value.habit.id == habitID) {
            value.today_logged = true
            // @ts-ignore
            value.cooperator_log_status[props.user.uid] = true
            if (resp.data.data.log_record) {
              if (value.log_records == undefined) {
                value.log_records = [resp.data.data.log_record]
              } else {
                value.log_records.push(resp.data.data.log_record)
              }
              value.user_custom_config.current_streak += 1
              if (value.user_custom_config.current_streak > value.user_custom_config.longest_streak) {
                value.user_custom_config.longest_streak = value.user_custom_config.current_streak
              }
            }
          }
          return value
        })
        setHabits(newHabits)
      }
    })
  }

  if (isFetchingHabit) {
    return (
      <SpinWaitIndicatorIcon className="m-auto w-20 h-20 fill-white"/>
    )
  }

  return (
    <div className="w-full py-4 px-52">
      {/*modal*/}
      {showModel && (
        <Modal
          onCancel={!isDeleting ? ()=>{setShowModal(false)} : undefined}
          onConfirm={!isDeleting ? () => {doDeleteHabit(deletingHabitID)}: undefined}
          confirmBtnStyle="alter"
        >
          {isDeleting ? (
            <div>
              <SpinWaitIndicatorIcon/>
              <p className="text-rose-300">deleting</p>
            </div>
          ) : (
            <div className="px-2">
              <p className="max-w-sm">the deleted habit can not be restored, are you sure to delete this habit</p>
            </div>
          )}
        </Modal>
      )}
      <div className="w-full space-y-8">
        <div className="flex">
          <button
            className="h-10 p-2 ml-auto rounded-md bg-black text-amber-50 shadow-[0px_3px_gray] active:translate-y-[3px] active:shadow-none"
            onClick={toNewHabitPage}
          >
            New Habit
          </button>
        </div>
        {/*habit table*/}
        {habits.length > 0 ? (
          <ul className="my-6">
            {habits.map((value, index) => {
              return (
                <li className="mb-8" key={index}>
                  <HabitCard
                    habit={value}
                    startData={startDate}
                    endDate={endDate}
                    onEditHabit={toEditHabitPage}
                    onDeleteHabit={() => {
                      setDeletingHabitID(value.habit.id)
                      setShowModal(true)
                    }}
                    onHabitLog={doHabitLog}
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="flex h-1/2">
            <div className="m-auto">No Habits, Create One</div>
          </div>
        )}

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
      {/*new habit btn*/}

    </div>
  )
}

export const getServerSideProps = CommonServerGetSideUserProp(false, true)
