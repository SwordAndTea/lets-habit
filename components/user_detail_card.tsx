import {SimplifiedUser} from "../util/user";
import React from "react";
import Image from "next/image";
import {DefaultUserPortraitIcon} from "./icons";
import {AnonymousUsername} from "../util/const";
import {useDropdownHandleOutsideClick} from "./hooks";

interface UserDetailCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: SimplifiedUser
  logged?: boolean
  presentStyle?: "hover" | "click"
  childrenContainerClassName?: string
}

export function UserDetailCard(props: UserDetailCardProps) {
  const [showCard, setShowCard, btnRef, cardRef] = useDropdownHandleOutsideClick()

  let onMouseEnter = undefined
  let onMouseLeave = undefined
  let onClick = undefined
  let ref = undefined
  if (props.presentStyle == "hover") {
    onMouseEnter = () => {
      setShowCard(true)
    }
    onMouseLeave = () => {
      setShowCard(false)
    }
  } else {
    onClick = () => {
      setShowCard(!showCard)
    }
    ref = btnRef
  }

  return (
    <div className="relative max-w-max max-h-min">
      {showCard && (
        <div className="absolute flex z-10 bottom-full -translate-y-2 right-0 w-68 h-24 border-2 bg-white rounded-lg"
             ref={cardRef}>
          <div
            className={"my-auto ml-2 mr-1 h-14 aspect-square z-20 rounded-full bg-blue-400 overflow-hidden border-2"}>
            {props.user.portrait ?
              <Image alt={props.user.uid} src={props.user.portrait} className="object-contain" fill/> :
              <DefaultUserPortraitIcon className="bg-white"/>}
          </div>
          <div className={"mr-2 flex flex-col justify-center"}>
            <p className="text-xl text-slate-700">{props.user.name ? props.user.name : AnonymousUsername}</p>
            <p className="text-sm text-slate-700">{props.user.uid}</p>
          </div>
          {props.logged != undefined && (
            <div
              className={`absolute top-1 right-1 w-[70px] h-[18px] leading-[14px] rounded text-xs text-center border
                ${props.logged ? "text-lime-500 border-lime-300 bg-lime-300/30" : "text-rose-500 border-rose-300 bg-rose-300/30"}`}>
              {props.logged ? "logged" : "not logged"}
            </div>
          )}
        </div>
      )}
      <div className={props.childrenContainerClassName}
        ref={ref}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {props.children}
      </div>
    </div>
  )
}
