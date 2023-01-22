import React, {useState} from "react";
import {DefaultUserPortraitIcon, PlusIcon, SpinWaitIndicatorIcon} from "./icons";
import {useDropdownHandleOutsideClick} from "./hooks";
import {userSearch} from "../api/user";
import {noti} from "../util/noti";


interface UserItemProps {
  portrait: string
  name: string
  uid: string
}

function UserItem(props: UserItemProps) {
  return (
    <div className="flex w-full">
      {/*portrait*/}
      <div className="w-10 h-10 rounded-full border-2 border-black mx-2 my-auto overflow-hidden">
        {props.portrait ? <img src={props.portrait} alt="user-portrait"/> : <DefaultUserPortraitIcon/>}
      </div>
      <div className="flex-1 mr-2">
        <h1>{props.name ? props.name : "unknown"}</h1>
        <span className="text-sm text-gray-500">{props.uid}</span>
      </div>
    </div>
  )
}

interface UserCardProps extends UserItemProps {
  onDelete?: () => void
}

function UserCard(props: UserCardProps) {

  const [showDeleteBtn, setShowDeleteBtn] = useState(false)

  return (
    <div
      className="relative flex m-2 border w-52"
      onMouseEnter={() => {
        setShowDeleteBtn(true)
      }}
      onMouseLeave={() => {
        setShowDeleteBtn(false)
      }}
    >
      {/*portrait*/}
      <div className="w-10 h-10 rounded-full border-2 border-black mx-2 my-auto overflow-hidden">
        {props.portrait ? <img src={props.portrait} alt="user-portrait"/> : <DefaultUserPortraitIcon/>}
      </div>
      <h1>{props.name ? props.name : "unknown"}</h1>

      {showDeleteBtn && (
        <button
          className="absolute top-0 right-0 rounded-full bg-gray-300"
          onClick={props.onDelete}
        >
          <PlusIcon fill="gray" className="rotate-45 w-3 h-3"/>
        </button>
      )}
    </div>
  )
}

interface UserSearcherProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  inputClassName?: string
  resultContainerClass?: string
  resultItemClass?: string
}

enum UserSearcherState {
  Waiting,
  Searching,
  Success,
  Fail,
}

export function UserSearcher(props: UserSearcherProps) {
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchResult, setSearchResult] = useState<UserItemProps[]>([])
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()
  const [searchState, setSearchState] = useState(UserSearcherState.Waiting)

  const {className, inputClassName, resultContainerClass, resultItemClass, ...otherProps} = props

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    let textValue = e.target.value
    if (textValue) {
      let newTimer = setTimeout(() => {
        setShowOptionList(true)
        setSearchState(UserSearcherState.Searching)
        userSearch(textValue).then((resp) => {
          if (resp.data && resp.data.data && resp.data.data.users) {
            setSearchResult(resp.data.data.users)
            setSearchState(UserSearcherState.Success)
          } else {
            noti.error("can not parse user search return data")
            setSearchState(UserSearcherState.Fail)
          }
        }).catch(() => {
          setSearchState(UserSearcherState.Fail)
        })
      }, 500)
      setSearchTimer(newTimer)
    } else {
      setSearchState(UserSearcherState.Waiting)
    }
  }
  return (
    <div
      className={`relative flex ${className}`}
      {...otherProps}
    >
      <UserCard portrait="" name="" uid="" />
      <input
        type="text"
        className={`w-full ${inputClassName}`}
        placeholder="type user name or user uid"
        ref={btnRef}
        onFocus={() => {
          // @ts-ignore
          if (btnRef.current.value) {
            setShowOptionList(true)
          }
        }}
        onChange={onInputChange}
      >
      </input>
      {showOptionList && (
        <div
          className={`absolute top-full left-0 right-0 w-full rounded-lg flex flex-col overflow-y-scroll ${resultContainerClass}`}
          ref={optionListRef}
        >
          {searchState == UserSearcherState.Searching &&
            <SpinWaitIndicatorIcon className="m-auto fill-transparent w-10 h-10"/>}
          {searchState == UserSearcherState.Success && searchResult.length > 0 && (
            <ul>
              {searchResult.map((value, index) => {
                return (
                  <li key={index} className={`${resultItemClass}`}>
                    <UserItem {...value}/>
                  </li>
                )
              })}
            </ul>
          )}
          {searchState == UserSearcherState.Success && searchResult.length == 0 && (
            <span className="m-auto">no results</span>)}
          {searchState == UserSearcherState.Fail && <span className="m-auto">search fail</span>}
        </div>
      )}

    </div>
  )
}
