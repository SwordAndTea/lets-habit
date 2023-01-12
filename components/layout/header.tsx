import {useRouter} from "next/router";
import {RoutePath} from "../../util/const";

function Header() {
  const route = useRouter()

  return (
    <header className="flex bg-slate-900 border-b pb-1 pt-1 shadow-lg">
      <button
        className="text-white mr-auto ml-4"
        onClick={()=>{route.replace(RoutePath.HomePage)}}
      >
        Lets-Habit
      </button>
      {/*<div className={`w-14 h-14 mx-auto`}>*/}
      {/*</div>*/}

      <button className="w-10 h-10 ml-auto mr-4 my-2 rounded-full border-2 border-white">
        Portrait
      </button>
    </header>
  );
}

export default Header
