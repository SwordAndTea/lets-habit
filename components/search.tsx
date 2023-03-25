import React, {useEffect, useState} from "react";
import {DefaultUserPortraitIcon, PlusIcon, SpinWaitIndicatorIcon, SquareCheckIcon} from "./icons";
import {useDropdownHandleOutsideClick} from "./hooks";
import {userSearch} from "../api/user";
import {noti} from "../util/noti";
import {AnonymousUsername} from "../util/const";
import {GetEventPath} from "../util/event";
import {SimplifiedUser} from "../util/user";
import {PopViewDisplayType, PopViewDisplayTypeFloat} from "./common";


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
        <h1>{props.user.name ? props.user.name : AnonymousUsername}</h1>
        <span className="text-sm text-gray-500">{props.user.uid}</span>
      </div>
      {/*selected indicator*/}
      {props.selected && (
        <SquareCheckIcon className="mr-2 my-auto h-1/2 aspect-square"/>
      )}
    </div>
  )
}

interface UserCardProps extends UserItemProps {
  cannotDelete?: boolean
  onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

function UserCard(props: UserCardProps) {

  return (
    <div className="relative flex m-1 mr-0 border min-w-[120px] max-w-[200px] bg-gray-300 rounded hover-show-parent">
      {/*portrait*/}
      <div className="h-5/6 aspect-square rounded-full border-2 border-black ml-2 mr-1 my-auto overflow-hidden">
        {props.user.portrait ? <img src={props.user.portrait} alt="user-portrait"/> : <DefaultUserPortraitIcon/>}
      </div>
      <span
        className="my-auto mr-2 flex-1 text-ellipsis overflow-hidden">{props.user.name ? props.user.name : AnonymousUsername}</span>

      {/*delete btn*/}
      {!props.cannotDelete && (
        <button
          className="absolute top-0 right-0 rounded-full bg-black hover-show-child"
          onClick={props.onDelete}
        >
          <PlusIcon fill="gray" className="rotate-45 w-3 h-3"/>
        </button>
      )}
    </div>
  )
}

interface UserSearcherProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  displayType?: PopViewDisplayType
  inputClassName?: string
  resultContainerClassName?: string
  resultItemClassName?: string
  fixedUsers?: SimplifiedUser[] | null //users will always be chosen, can not delete
  defaultUsers?: SimplifiedUser[] | null
  onSelectUserChange?: (users: SimplifiedUser[]) => void
  disabled?: boolean
}

enum UserSearcherState {
  Waiting,
  Searching,
  Success,
  Fail,
}

function mergeUsers(lUserGroup: SimplifiedUser[] | undefined | null, rUserGroup: SimplifiedUser[] | undefined | null) {
  let finalUsers = lUserGroup ? lUserGroup : []
  if (rUserGroup) {
    if (finalUsers.length == 0) {
      return rUserGroup
    }
    let filteredUsers = rUserGroup.filter((currentItem1) => {
      return  finalUsers.findIndex((currentItem2) => {
        return currentItem1.uid == currentItem2.uid
      }) == -1
    })
    finalUsers = finalUsers.concat(filteredUsers)
  }
  return finalUsers
}

export function UserSearcher(props: UserSearcherProps) {
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)
  const [searchResult, setSearchResult] = useState<SimplifiedUser[]>([])
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()
  const [searchState, setSearchState] = useState(UserSearcherState.Waiting)

  const {
    className, displayType, inputClassName, resultContainerClassName, resultItemClassName,
    fixedUsers, defaultUsers, onSelectUserChange, disabled, ...otherProps
  } = props

  const [selectedUsers, setSelectedUsers] = useState<SimplifiedUser[]>([])

  useEffect(()=>{
    setSelectedUsers(mergeUsers(fixedUsers, defaultUsers))
  }, [fixedUsers, defaultUsers])

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
      setShowOptionList(false)
    }
  }

  const handleUserChoose = (e: React.MouseEvent<HTMLUListElement>) => {
    let path = GetEventPath(e)
    if (path.length >= 2) {
      let li = path[path.length - 2]
      let chosenUser = searchResult[li.value]
      for (let u of selectedUsers) {
        if (u.uid == chosenUser.uid) {
          return
        }
      }
      let newUserList = [...selectedUsers, chosenUser]
      setSelectedUsers(newUserList)
      if (onSelectUserChange) {
        onSelectUserChange(newUserList)
      }
    }
  }

  return (
    <div className={`relative ${disabled ? "pointer-events-none" : ""}`}>
      <div
        className={`flex flex-wrap ${className}`}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Backspace":
              if (fixedUsers && selectedUsers.length == fixedUsers.length) {
                return
              }
              // @ts-ignore
              if (!btnRef.current.value && selectedUsers.length != 0) {
                let copy = [...selectedUsers]
                copy.pop()
                setSelectedUsers(copy)
                if (props.onSelectUserChange) {
                  props.onSelectUserChange(copy)
                }
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
          return (
            <UserCard
              key={index}
              user={value}
              onDelete={(e) => {
                let newUserList = selectedUsers.filter(a => a.uid != value.uid)
                setSelectedUsers(newUserList)
                if (onSelectUserChange) {
                  onSelectUserChange(newUserList)
                }
              }}
              cannotDelete={fixedUsers?.length ? index < fixedUsers.length : true}
            />
          )
        })}

        <input
          type="text"
          className={`flex-1 ${inputClassName}`}
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
      </div>
      <div
        className={`${displayType == PopViewDisplayTypeFloat ? "absolute z-50 top-full left-0 right-0" : "w-full"}
          rounded-lg bg-gray-200
          transition-all duration-300
          flex flex-col
          ${showOptionList ? "h-[200px] overflow-scroll" : "h-0 overflow-hidden"}
          ${resultContainerClassName}`}
        ref={optionListRef}
      >
        {showOptionList && searchState == UserSearcherState.Searching &&
          <SpinWaitIndicatorIcon className="m-auto fill-transparent w-10 h-10"/>}
        {showOptionList && searchState == UserSearcherState.Success && searchResult.length > 0 && (
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
        {showOptionList && searchState == UserSearcherState.Success && searchResult.length == 0 && (
          <span className="m-auto">no results</span>)}
        {showOptionList && searchState == UserSearcherState.Fail && <span className="m-auto">search fail</span>}
      </div>
    </div>
  )
}
