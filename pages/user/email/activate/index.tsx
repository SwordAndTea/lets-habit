import {
  EmailActivateActivateCodeParam,
  UserLocalStorageKey,
} from "../../../../util/const";
import {useEffect, useState} from "react";
import {userEmailActivate} from "../../../../api/user";
import {useRouter} from "next/router";
import {noti} from "../../../../util/noti";


enum AccountActivateState {
  Begin,
  Success,
  Fail,
}


export default function EmailActivatePage() {
  const [accountActivateState, setAccountActivateState] = useState(AccountActivateState.Begin)
  const [activateFailReason, setActivateFailReason] = useState("")
  const route = useRouter()

  useEffect(() => {
    if (route.isReady) {
      let activateCode = route.query[EmailActivateActivateCodeParam]
      if (activateCode) {
        doEmailActivate(activateCode as string)
      } else {
        noti.error("no activate code found")
        setAccountActivateState(AccountActivateState.Fail)
        setActivateFailReason("no activate code found")
      }
    }
  },[route.isReady])


  const doEmailActivate = (activeCode: string) => {
    setAccountActivateState(AccountActivateState.Begin)
    userEmailActivate(activeCode).then((resp) => {
      localStorage.setItem(UserLocalStorageKey, JSON.stringify(resp.data.data.user))
      setAccountActivateState(AccountActivateState.Success)
    }).catch(({msg}) => {
      setAccountActivateState(AccountActivateState.Fail)
      setActivateFailReason(msg)
    })
  }

  return (
    <div className="m-auto">
      <p className="text-xl">
        {accountActivateState == AccountActivateState.Begin && "activating, please wait a second 🌊"}
        {accountActivateState == AccountActivateState.Success && "your account has been activated 👏🥳👏"}
        {accountActivateState == AccountActivateState.Fail && `oops, activate failed, ${activateFailReason} 🤔`}
      </p>
    </div>
  )
}
