import {useEffect, useState} from "react";


function Header() {
  const [userName, setUserName] = useState("unknown");

  useEffect(() => {
    return () => {
      //TODO: get user name from localstorage
      setUserName("")
    };
  });


  // eslint-disable-next-line react/jsx-key

  return (
    <header className="flex bg-gray-800 border-b pb-1 pt-1 shadow-lg">
      <button className="w-14 h-14 bg-orange-300 mr-auto ml-1">
        {userName}
      </button>
      {/*<div className={`w-14 h-14 mx-auto`}>*/}
      {/*</div>*/}

      <button className="w-14 h-14 bg-orange-300 ml-auto mr-1">
        Portrait
      </button>
    </header>
  );
}

export default Header