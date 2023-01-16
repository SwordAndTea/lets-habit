import React, {useState} from "react";
import {useDropdownHandleOutsideClick} from "./hooks";


interface SelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: string[]
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export default function Select(props: SelectProps) {
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()
  const {className, ...otherProps} = props
  const [selectedValue, setSelectedValue] = useState(props.defaultValue ? props.defaultValue : "")

  const handleOptionChoose = (e: React.MouseEvent<HTMLUListElement>) => {
    // @ts-ignore
    let newValue = props.options[e.target.value]
    setSelectedValue(newValue)
    setShowOptionList(false)
    if (props.onValueChange) {
      props.onValueChange(newValue)
    }
  }

  return (
    <button
      className={`relative flex px-1 ${className}`}
      ref={btnRef}
      onClick={()=>{setShowOptionList(!showOptionList)}}
      {...otherProps}
    >
      <span className="my-auto">{selectedValue}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 my-auto ml-auto"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      {showOptionList && (
        <ul
          className="absolute top-[125%] left-0 right-0 bg-base-100 rounded-lg z-[999] bg-gray-200"
          ref={optionListRef}
          onClick={handleOptionChoose}
        >
          {props.options.map((value, index)=>{
            return <li className={`text-left px-1 py-2 hover:bg-gray-300 ${index == 0 ? "rounded-t-lg":""} ${index == props.options.length - 1 ? "rounded-b-lg": ""}`} key={index} value={index}>{value}</li>
          })}
        </ul>
      )}
    </button>
  )
}
