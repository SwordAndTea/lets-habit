import {PlusIcon} from "./icons";
import React, {useEffect, useState} from "react";

interface ModalProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
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
        className={`relative ${startAnimate ? "max-w-3xl max-h-28 py-2" : "max-w-0 max-h-0"} rounded-lg m-auto flex flex-col bg-gray-800 overflow-hidden transition-all duration-500`}>
        {props.closable && (
          <button className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gray-300 flex">
            <PlusIcon fill="gray" className="m-auto rotate-45 w-3 h-3"/>
          </button>
        )}
        {props.children}
      </div>
    </div>
  )
}
