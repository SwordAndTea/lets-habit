import {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from "react";


export function useDropdownHandleOutsideClick(): [boolean, Dispatch<SetStateAction<boolean>>,  MutableRefObject<null>,  MutableRefObject<null>] {
  const btnRef = useRef(null);
  const optionListRef = useRef(null);
  const [showOptionList, setShowOptionList] = useState(false);


  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (!btnRef.current && !optionListRef.current) {
        return
      }

      // @ts-ignore
      if (btnRef.current && (e.target == btnRef.current || btnRef.current.contains(e.target as Node))) {
        return
      }

      // @ts-ignore
      if (optionListRef.current && e.target != optionListRef.current && !optionListRef.current.contains(e.target as Node)) {
        // click outside
        setShowOptionList(false)
      }
    }

    if (showOptionList) {
      document.addEventListener("mousedown", handleClickOutside)
      return ()=> {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }

  }, [showOptionList]);


  return [showOptionList, setShowOptionList, btnRef, optionListRef]
}
