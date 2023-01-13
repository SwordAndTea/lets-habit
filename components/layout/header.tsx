import {useRouter} from "next/router";
import {RoutePath} from "../../util/const";
import {useEffect, useRef, useState} from "react";
import {GetLocalUserInfo, InitialUser, User} from "../../util/user";

function Header() {
  const route = useRouter()
  const [userInfo, setUserInfo] = useState<User>(InitialUser);
  const defaultUserPortraitSrc = "/default-user-portrait.svg"
  const [showUserCard, setShowUserCard] = useState(false)
  const portraitRef = useRef(null);
  const popRef = useRef(null);

  const handleOutsideClick = (e: Event) => {
    if (!popRef.current || !portraitRef.current) {
      return
    }

    // @ts-ignore
    if (portraitRef.current.contains(e.target as Node)) {
      return
    }

    // @ts-ignore
    if (e.target != popRef.current && !popRef.current.contains(e.target as Node)) {
      setShowUserCard(false)
    }
  }

  useEffect(() => {
    if (route.isReady) {
      let user = GetLocalUserInfo()
      if (user) {
        setUserInfo(user)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return ()=>{
      document.removeEventListener("click", handleOutsideClick)
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
          ref={portraitRef}
          onClick={()=>{setShowUserCard(!showUserCard)}}
        >
          <img
            src={(userInfo.portrait) ? userInfo.portrait : defaultUserPortraitSrc}
            alt="user-portrait"
          />
        </button>
        {showUserCard && (
          <ul
            className="absolute top-[125%] right-0 w-32 p-2 z-[999] bg-slate-600 rounded-lg"
            ref={popRef}
          >
            <li>
              <h1 className="text-amber-50 text-xl">
                {userInfo.name ? userInfo.name : "unknown"}
              </h1>
            </li>
            <li>
              <button
                onClick={()=>{
                  setShowUserCard(false)
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
