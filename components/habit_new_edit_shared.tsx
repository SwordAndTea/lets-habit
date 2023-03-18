import React, {ReactNode} from "react";

interface HabitInfoItemWrapProps {
  name: string
  children: ReactNode
}

export function HabitInfoItemWrap(props: HabitInfoItemWrapProps) {
  return (
    <div className="space-y-1">
      <span className="text-gray-400">{props.name}</span>
      {props.children}
    </div>
  )
}


