import React, {useEffect, useState} from "react";
import {useDropdownHandleOutsideClick} from "./hooks";


enum SelectDisplayType {
  Collapse = "collapse",
  Float = "float"
}

interface SelectProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  options: string[]
  defaultValue?: string
  displayType?: string
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
  const [isMouseClick, setIsMouseClick] = useState(false)

  const handleOptionChoose = (e: React.MouseEvent<HTMLUListElement>) => {
    // @ts-ignore
    let newValue = options[e.target.value]
    setSelectedValue(newValue)
    setShowOptionList(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  useEffect(() => {
    if (!showOptionList) {
      setIsMouseClick(false)
    }
  }, [showOptionList])

  return (
    <div className={`relative ${className}`} {...otherProps}>
      <button
        className={`w-full min-h-[44px] flex ${buttonClassName}`}
        ref={btnRef}
        onMouseDown={() => {
          setIsMouseClick(true)
        }}
        onFocus={() => {
          if (!isMouseClick) { // tab to show
            setShowOptionList(true)
          }
        }}
        onBlur={() => {
          if (!isMouseClick) {// tab to hide
            setShowOptionList(false)
          }
        }}
        onClick={() => {
          setShowOptionList(!showOptionList)
        }}
      >
        <span className="ml-2 my-auto">{selectedValue}</span>
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
        className={`${displayType == SelectDisplayType.Float ? "absolute top-full left-0 right-0 z-[999]" : "w-full"}
        rounded-lg bg-gray-200
        transition-all duration-25 max-h-0 overflow-hidden
        ${showOptionList ? "max-h-[150px] overflow-scroll" : ""}
        ${optionListContainerClassName}`}
        ref={optionListRef}
        onClick={handleOptionChoose}
      >
        {options.map((value, index) => {
          return <li
            className={`text-left hover:bg-gray-300
              ${index == 0 ? "rounded-t-lg" : ""}
              ${index == options.length - 1 ? "rounded-b-lg" : ""}
              ${optionListItemViewClassName}
              `}
            key={index}
            value={index}>
            {value}
          </li>
        })}
      </ul>
    </div>
  )
}
