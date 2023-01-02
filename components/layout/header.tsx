import {useEffect, useState} from "react";


function Header() {
  const [userName, setUserName] = useState("unknown");

  useEffect(() => {
    return () => {
      //TODO: get username from localstorage
      setUserName("")
    };
  });


  // eslint-disable-next-line react/jsx-key

  return (
    <header className="flex bg-gray-800 border-b pb-1 pt-1 shadow-lg">
      <button className="text-white mr-auto ml-4">
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
