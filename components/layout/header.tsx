import {useRouter} from "next/router";
import {RoutePath} from "../../util/const";
import {useEffect, useState} from "react";
import {GetLocalUserInfo, InitialUser, User} from "../../util/user";
import {useDropdownHandleOutsideClick} from "../hooks";

function Header() {
  const route = useRouter()
  const [userInfo, setUserInfo] = useState<User>(InitialUser);
  const defaultUserPortraitSrc = "/default-user-portrait.svg"
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()

  useEffect(() => {
    if (route.isReady) {
      let user = GetLocalUserInfo()
      if (user) {
        setUserInfo(user)
      }
    }
  }, [route.isReady]);


  return (
    <header className="flex bg-slate-900 border-b pb-1 pt-1 shadow-lg">
      <button
        className="text-white mr-auto ml-4"
        onClick={()=>{route.replace(RoutePath.HomePage)}}
      >
        Lets-Habit
      </button>

      <div className="w-10 h-10 ml-auto mr-4 my-2 relative">
        <button
          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
          ref={btnRef}
          onClick={()=>{setShowOptionList(!showOptionList)}}
        >
          <img
            src={(userInfo.portrait) ? userInfo.portrait : defaultUserPortraitSrc}
            alt="user-portrait"
          />
        </button>
        {showOptionList && (
          <ul
            className="absolute top-[125%] right-0 w-32 p-2 z-[999] bg-slate-600 rounded-lg"
            ref={optionListRef}
          >
            <li>
              <h1 className="text-amber-50 text-xl">
                {userInfo.name ? userInfo.name : "unknown"}
              </h1>
            </li>
            <li>
              <button
                onClick={()=>{
                  setShowOptionList(false)
                  route.push("/user/setting")
                }}
              >
                setting
              </button>
            </li>
          </ul>
        )}
      </div>

    </header>
  );
}

export default Header
