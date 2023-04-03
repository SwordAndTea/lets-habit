import React from "react";

interface TooltipProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  direction: "top" | "right" | "bottom" | "left"
  text: string
  tipContainerClass? : string
}

export function Tooltip(props: TooltipProps) {
  let positionClass = ""
  switch (props.direction) {
    case "top":
      positionClass = "bottom-[105%] left-1/2 -translate-x-1/2"
      break
    case "right":
      positionClass = "left-[105%] top-1/2 -translate-y-1/2"
      break
    case "bottom":
      positionClass = "top-[105%] left-1/2 -translate-x-1/2"
      break
    case "left":
      positionClass = "right-[105%] top-1/2 -translate-y-1/2"
      break
  }

  //TODO: add before pseudo class for triangle

  return (
    <div className="relative hover-show-parent max-w-max">
      {props.children}
      <div className={`absolute z-10 hover-show-child ${positionClass} ${props.tipContainerClass}`}>
        {props.text}
      </div>
    </div>
  )
}
