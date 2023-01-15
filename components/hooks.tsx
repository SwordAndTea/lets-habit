import {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";


export function useDropdownHandleOutsideClick(autoHandleBtnClick: boolean): [boolean, Dispatch<SetStateAction<boolean>>,  MutableRefObject<null>,  MutableRefObject<null>] {
  const btnRef = useRef(null);
  const optionListRef = useRef(null);
  const [showOptionList, setShowOptionList] = useState(false);

  const handleClickOutside = (e: Event) => {
    if (!btnRef.current && !optionListRef.current) {
      return
    }

    // @ts-ignore
    if (btnRef.current && (e.target == btnRef.current || btnRef.current.contains(e.target as Node))) {
      // @ts-ignore
      if (optionListRef.current && btnRef.current.contains(optionListRef.current as Node) && optionListRef.current.contains(e.target as Node)) {
        return
      }
      // clicking on button
      if (autoHandleBtnClick) {
        setShowOptionList(!showOptionList)
      }
      return
    }

    // @ts-ignore
    if (optionListRef.current && e.target != optionListRef.current && !optionListRef.current.contains(e.target as Node)) {
      // click outside
      setShowOptionList(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return ()=> {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [handleClickOutside]);


  return [showOptionList, setShowOptionList, btnRef, optionListRef]
}
