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
}

export function UserDetailCard(props: UserDetailCardProps) {
  const [showCard, setShowCard, btnRef, cardRef] = useDropdownHandleOutsideClick()

  const wrapperClassName = "relative max-w-max"
  const cardContainerClassName = "absolute flex z-10 bottom-full -translate-y-2 right-0 w-68 h-20 border-2 bg-white rounded-lg"
  const portraitClassName = "my-auto ml-2 mr-1 h-14 aspect-square z-20 rounded-full bg-blue-400 overflow-hidden border-2"
  let portrait = props.user.portrait ?
    <Image alt={props.user.uid} src={props.user.portrait} className="object-contain" fill/> :
    <DefaultUserPortraitIcon className="bg-white"/>
  const textContainerClassName = "mr-2 flex flex-col justify-center"
  const logTagClassName = `absolute top-1 right-1 w-[70px] h-[18px] leading-[14px] rounded text-xs text-center border
  ${props.logged ? "text-lime-500 border-lime-300 bg-lime-300/30" : "text-rose-500 border-rose-300 bg-rose-300/30"}`

  if (props.presentStyle == "hover") {
    return (
      <div className={`hover-show-parent ${wrapperClassName}`}>
        <div className={`hover-show-child ${cardContainerClassName}`}>
          <div className={portraitClassName}>
            {portrait}
          </div>
          <div className={textContainerClassName}>
            <p className="text-xl text-slate-700">{props.user.name ? props.user.name : AnonymousUsername}</p>
            <p className="text-sm text-slate-700">{props.user.uid}</p>
          </div>
          {props.logged != undefined && (
            <div
              className={logTagClassName}>
              {props.logged ? "logged" : "not logged"}
            </div>
          )}
        </div>
        <div>
          {props.children}
        </div>
      </div>
    )
  } else {
    return (
      <div className={wrapperClassName}>
        {showCard && (
          <div className={cardContainerClassName} ref={cardRef}>
            <div className={portraitClassName}>
              {portrait}
            </div>
            <div className={textContainerClassName}>
              <p className="text-xl text-slate-700">{props.user.name ? props.user.name : AnonymousUsername}</p>
              <p className="text-sm text-slate-700">{props.user.uid}</p>
            </div>
            {props.logged != undefined && (
              <div
                className={logTagClassName}>
                {props.logged ? "logged" : "not logged"}
              </div>
            )}
          </div>
        )}
        <div ref={btnRef} onClick={() => {
          setShowCard(!showCard)
        }}>
          {props.children}
        </div>
      </div>
    )
  }


}
