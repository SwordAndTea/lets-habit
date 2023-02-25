import React, {useState} from "react";
import {useDropdownHandleOutsideClick} from "./hooks";
import {PopViewDisplayType, PopViewDisplayTypeFloat} from "./common";

interface SelectProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  options: string[]
  defaultValue?: string
  displayType?: PopViewDisplayType
  buttonClassName?: string
  optionListContainerClassName?: string
  optionListItemViewClassName?: string
  onValueChange?: (value: string) => void
}

export default function Select(props: SelectProps) {
  const {
    className,
    options,
    defaultValue,
    displayType,
    buttonClassName,
    optionListContainerClassName,
    optionListItemViewClassName,
    onValueChange, ...otherProps
  } = props

  const [selectedValue, setSelectedValue] = useState(defaultValue ? defaultValue : "")
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()

  const handleOptionChoose = (e: React.MouseEvent<HTMLUListElement>) => {
    // @ts-ignore
    let newValue = options[e.target.value]
    setSelectedValue(newValue)
    setShowOptionList(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className={`relative ${className}`} {...otherProps}>
      <button
        className={`w-full flex ${buttonClassName}`}
        ref={btnRef}
        onClick={() => {
          setShowOptionList(!showOptionList)
        }}
      >
        <span className="ml-2 my-auto">{selectedValue}</span>
        {/*indicator icon*/}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 my-auto ml-auto mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul
        className={`${displayType == PopViewDisplayTypeFloat ? "absolute top-full left-0 right-0 z-50" : "w-full"}
          rounded-lg bg-gray-200
          transition-all duration-200
          ${showOptionList ? "max-h-[150px] overflow-scroll" : "max-h-0 overflow-hidden"}
          ${optionListContainerClassName}`}
        ref={optionListRef}
        onClick={handleOptionChoose}
      >
        {options.map((value, index) => {
          return <li
            className={`text-left hover:bg-gray-300 ${optionListItemViewClassName}`}
            key={index}
            value={index}>
            {value}
          </li>
        })}
      </ul>
    </div>
  )
}
