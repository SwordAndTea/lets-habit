import {SimplifiedUser} from "../util/user";
import Image from "next/image";
import {DefaultUserPortraitIcon} from "./icons";
import React from "react";
import {UserDetailCard} from "./user_detail_card";

interface AvatarListProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  users: SimplifiedUser[]
  logStatus?: Map<string, boolean>
}

export function AvatarList(props: AvatarListProps) {
  const {users, logStatus, className, ...otherProps} = props
  return (
    <div
      className={`flex flex-wrap flex-row-reverse -space-x-1 space-x-reverse py-2 ${className}`}
      {...otherProps}
    >
      {users.map((value) => {
        // TODO: use dots if user is too much
        let bgColor = logStatus && logStatus.get(value.uid) ? "bg-lime-300" : "bg-rose-300"
        return (
          <div key={value.uid} className="flex flex-col space-y-1">
            <UserDetailCard user={value} logged={!!logStatus?.get(value.uid)}>
              <div className="relative my-auto w-7 aspect-square rounded-full border-2 border-white overflow-hidden cursor-pointer">
                {value.portrait ?
                  <Image alt={value.uid} src={value.portrait} className="object-contain" fill/> :
                  <DefaultUserPortraitIcon className="bg-gray-200"/>
                }
              </div>
            </UserDetailCard>
            <div className={`mx-auto w-2 h-2 rounded-full ${bgColor}`}/>
          </div>
        )
      })}
    </div>
  )
}
