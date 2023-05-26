import {AnonymousUsername, RoutePath} from "../../util/const";
import {useDropdownHandleOutsideClick} from "../hooks";
import {DefaultUserPortraitIcon} from "../icons";
import Image from "next/image";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {RootState} from "../../util/store";

function Header() {
  const route = useRouter()
  const user = useSelector((state: RootState) => state.user.user)
  const [showOptionList, setShowOptionList, btnRef, optionListRef] = useDropdownHandleOutsideClick()

  return (
    <header className="flex bg-black pb-1 pt-1 shadow-lg">
      {/*logo*/}
      <button
        className="text-white mr-auto ml-6"
        onClick={() => {
          route.replace({
            pathname: RoutePath.HomePage,
            query: {"page": 1},
          })
        }}
      >
        Lets-Habit
      </button>

      {/*user portrait*/}
      <div className="relative w-10 h-10 ml-auto mr-6 my-2">
        <button
          className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
          ref={btnRef}
          onClick={() => {
            setShowOptionList(!showOptionList)
          }}
        >
          {user.portrait ? <Image src={user.portrait} alt="user-portrait" fill/> :
            <DefaultUserPortraitIcon fill="white"/>}
        </button>
        {showOptionList && (
          <ul
            className="absolute top-[125%] right-0 w-32 p-2 z-50 bg-slate-600 rounded-lg"
            ref={optionListRef}
          >
            <li>
              <h1 className="text-amber-50 text-xl">
                {user.name ? user.name : AnonymousUsername}
              </h1>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowOptionList(false)
                  route.push(RoutePath.UserSettingPage)
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
