import {EmailActivateActivateCodeParam, UserTokenHeader} from "../../../../util/const";
import {useEffect, useState} from "react";
import {userEmailActivate} from "../../../../api/user";
import {LayoutFooterOnly} from "../../../../components/layout/layout";
import {useRouter} from "next/router";


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
      const activateCode = route.query[EmailActivateActivateCodeParam] ? route.query[EmailActivateActivateCodeParam] as string : ""
      doEmailActivate(activateCode)
    }
  },[route.isReady])


  const doEmailActivate = (activeCode: string) => {
    userEmailActivate(activeCode).then((resp) => {
      console.log("resp is :", resp)
      console.log(resp.headers[UserTokenHeader])
      if (resp.data && resp.data.data && resp.data.data.hasOwnProperty("user") &&
        resp.headers && resp.headers[UserTokenHeader]) {
        localStorage.setItem("user", JSON.stringify(resp.data.data.user))
        localStorage.setItem(UserTokenHeader, resp.headers[UserTokenHeader])
        setAccountActivateState(AccountActivateState.Success)
      } else {
        setAccountActivateState(AccountActivateState.Fail)
        setActivateFailReason("unable to process activate return data")
      }
    }).catch(({err, msg, isAuthFail}) => {
      setAccountActivateState(AccountActivateState.Fail)
      setActivateFailReason(msg)
    })
  }

  return (
    <div className="m-auto">
      <p className="text-xl">
        {accountActivateState == AccountActivateState.Begin && "activating, please wait a second 🌊"}
        {accountActivateState == AccountActivateState.Success && "your count has been activated 👏🥳👏"}
        {accountActivateState == AccountActivateState.Fail && `oops, activate failed, ${activateFailReason} 🤔`}
      </p>
    </div>
  )
}

// @ts-ignore
EmailActivatePage.getLayout = (page) => {
  return <LayoutFooterOnly>{page}</LayoutFooterOnly>
}
