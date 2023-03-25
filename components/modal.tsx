import {CircleCheckIcon, PlusIcon, SpinWaitIndicatorIcon} from "./icons";
import React, {useEffect, useState} from "react";

interface ModalProps {
  text: string
  state: "waiting" | "done"
  closable?: boolean
  onClose?: () => void
}

export function Modal(props: ModalProps) {
  const [startAnimate, setStartAnimate] = useState(false)

  useEffect(() => {
    setStartAnimate(true)
  }, [])

  return (
    <div className="fixed z-50 top-0 right-0 bottom-0 left-0 flex bg-gray-500/75">
      <div
        className={`relative ${startAnimate ? "w-60 h-28 py-2" : "w-0 h-0"} rounded-lg m-auto flex flex-col bg-gray-800 overflow-hidden transition-all duration-500`}>
        {props.closable && (
          <button className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-300 flex">
            <PlusIcon fill="gray" className="m-auto rotate-45 w-3 h-3"/>
          </button>
        )}
        <SpinWaitIndicatorIcon
          className={`m-auto transition-all duration-100 ${props.state == "waiting" ? "visible w-10 h-10" : "hidden w-0 h-0"}`}
          indicatorColor={"white"}
        />
        <CircleCheckIcon
          className={`mx-auto fill-pink-500 transition-all duration-100 ${props.state == "done" ? "visible w-10 h-10" : "hidden w-0 h-0"}`}/>
        <span className="block mx-auto text-white animate-bounce">{props.text}</span>
      </div>
    </div>
  )
}
