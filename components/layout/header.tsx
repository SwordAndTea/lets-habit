import {useRouter} from "next/router";
import {RoutePath} from "../../util/const";

function Header() {
  const route = useRouter()

  return (
    <header className="flex bg-gray-800 border-b pb-1 pt-1 shadow-lg">
      <button
        className="text-white mr-auto ml-4"
        onClick={()=>{route.replace(RoutePath.HomePage)}}
      >
        Lets-Habit
      </button>
      {/*<div className={`w-14 h-14 mx-auto`}>*/}
      {/*</div>*/}

      <button className="w-14 h-14 bg-orange-300 ml-auto mr-4">
        Portrait
      </button>
    </header>
  );
}

export default Header
