import {SimplifiedUser} from "../util/user";
import React from "react";

interface HoverUserCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  user: SimplifiedUser
}

export function HoverUserCard(props: HoverUserCardProps) {
  return (
    <div className="relative hover-show-parent max-w-max">
      <div className="absolute z-10 bottom-[105%] left-1/2 -translate-x-1/2 hover-show-child">
        {/*TODO: finish user cord view*/}
        <div className="h-20 w-20 bg-red-300"></div>
      </div>
      {props.children}
    </div>
  )
}
