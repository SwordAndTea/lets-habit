import React, {useState} from "react";
import {DefaultUserPortraitIcon, PlusIcon, SpinWaitIndicatorIcon, SquareCheckIcon} from "./icons";
import {useDropdownHandleOutsideClick} from "./hooks";
import {userSearch} from "../api/user";
import {noti} from "../util/noti";
import {AnonymousUsername} from "../util/const";
import {GetEventPath} from "../util/event";
import {SimplifiedUser} from "../util/user";


interface UserItemProps {
  user: SimplifiedUser
  selected?: boolean
}

function UserItem(props: UserItemProps) {
  return (
    <div className="flex w-full h-full">
      {/*portrait*/}
      <div className="h-5/6 aspect-square rounded-full border-2 border-black mx-2 my-auto overflow-hidden">
        {props.user.portrait ? <img src={props.user.portrait} alt="user-portrait"/> : <DefaultUserPortraitIcon/>}
      </div>
      {/*name and uid*/}
      <div className="flex-1 mr-2 h-full">
        <h1>{props.user.name ? props.user.name : "unknown"}</h1>
        <span className="text-sm text-gray-500">{props.user.uid}</span>
      </div>
      {/*selected indicator*/}
      {props.selected && (
        <SquareCheckIcon className="mr-2 my-auto h-1/2 aspect-square" />
      )}
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
      className="relative flex m-1 mr-0 border w-40 bg-gray-300"
      onMouseEnter={() => {
        setShowDeleteBtn(true)
      }}
      onMouseLeave={() => {
        setShowDeleteBtn(false)
      }}
    >
      {/*portrait*/}
      <div className="h-5/6 aspect-square rounded-full border-2 border-black mx-1 my-auto overflow-hidden">
        {props.user.portrait ? <img src={props.user.portrait} alt="user-portrait"/> : <DefaultUserPortraitIcon/>}
      </div>
      <span className="my-auto flex-1 text-ellipsis overflow-hidden text-center">{props.user.name ? props.user.name : AnonymousUsername}</span>

      {/*delete btn*/}
      {showDeleteBtn && (
        <button
          className="absolute top-0 right-0 rounded-full bg-black"
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
  resultContainerClassName?: string
  resultItemClassName?: string
}

enum UserSearcherState {
  Waiting,
  Searching,
  Success,
  Fail,
}

export function UserSearcher(props: UserSearcherProps) {
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchResult, setSearchResult] = useState<SimplifiedUser[]>([])
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()
  const [searchState, setSearchState] = useState(UserSearcherState.Waiting)

  const {className, inputClassName, resultContainerClassName, resultItemClassName, ...otherProps} = props

  const [selectedUsers, setSelectedUsers] = useState<SimplifiedUser[]>([])

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

  const handleUserChoose = (e: React.MouseEvent<HTMLUListElement>)=>{
    let path = GetEventPath(e)
    if (path.length >= 2) {
      let li = path[path.length-2]
      let chosenUser = searchResult[li.value]
      for (let u of selectedUsers) {
        if (u.uid == chosenUser.uid) {
          return
        }
      }
      setSelectedUsers([...selectedUsers, chosenUser])
    }
  }

  return (
    <div
      className={`relative flex ${className}`}
      onKeyDown={(e) =>{
        switch (e.key) {
          case "Backspace":
            // @ts-ignore
            if (!btnRef.current.value && selectedUsers.length != 0) {
              let copy = [...selectedUsers]
              copy.pop()
              setSelectedUsers(copy)
            }
            break
          case "Escape":
            setShowOptionList(false)
            break
        }
      }}
      {...otherProps}
    >
      {selectedUsers.map((value, index) => {
        return <UserCard key={index} user={value} onDelete={() => {
          setSelectedUsers(selectedUsers.filter(a => a.uid != value.uid))
        }}/>
      })}

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
      />
      {showOptionList && (
        <div
          className={`absolute z-[999] top-full left-0 right-0 w-full rounded-lg flex flex-col overflow-y-scroll min-h-[200px] bg-gray-200 ${resultContainerClassName}`}
          ref={optionListRef}
        >
          {searchState == UserSearcherState.Searching &&
            <SpinWaitIndicatorIcon className="m-auto fill-transparent w-10 h-10"/>}
          {searchState == UserSearcherState.Success && searchResult.length > 0 && (
            <ul onClick={handleUserChoose}>
              {searchResult.map((value, index) => {
                return (
                  <li
                    key={index}
                    value={index}
                    className={`h-12 hover:bg-gray-300 ${resultItemClassName}`}
                  >
                    <UserItem user={value} selected={selectedUsers.findIndex(a => a.uid == value.uid) != -1}/>
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
