import React from "react";

interface TooltipProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  direction: "top" | "right" | "bottom" | "left"
  text: string
  tipContainerClassName? : string
}

export function Tooltip(props: TooltipProps) {
  const {className, direction, text, tipContainerClassName, children, ...otherProps} = props

  let positionClass = ""
  switch (direction) {
    case "top":
      positionClass = "bottom-full -translate-y-[10px] left-1/2 -translate-x-1/2 " +
        "after:content-[' '] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 " +
        "after:border-4 after:border-t-gray-700 " +
        "after:border-r-transparent after:border-b-transparent after:border-l-transparent"
      break
    case "right":
      positionClass = "left-full translate-x-[10px] top-1/2 -translate-y-1/2 " +
        "after:content-[' '] after:absolute after:right-full after:top-1/2 after:-translate-y-1/2 " +
        "after:border-4 after:border-r-gray-700 " +
        "after:border-t-transparent after:border-b-transparent after:border-l-transparent"
      break
    case "bottom":
      positionClass = "top-full translate-y-[10px] left-1/2 -translate-x-1/2 " +
        "after:content-[' '] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 " +
        "after:border-4 after:border-b-gray-700 " +
        "after:border-t-transparent after:border-r-transparent after:border-l-transparent"
      break
    case "left":
      positionClass = "right-full -translate-x-[10px] top-1/2 -translate-y-1/2 " +
        "after:content-[' '] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 " +
        "after:border-4 after:border-l-gray-700 " +
        "after:border-t-transparent after:border-b-transparent after:border-r-transparent"
      break
  }

  return (
    <div
      className={`relative hover-show-parent ${className}`}
      {...otherProps}
    >
      {children}
      <div
        className={`absolute hover-show-child z-10 bg-gray-700 text-white text-center px-4 py-0.5 rounded ${positionClass} ${tipContainerClassName}`}
      >
        {text}
      </div>
    </div>
  )
}
