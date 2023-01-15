import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {userEmailActivateResend} from "../../../../api/user";
import {EmailIcon} from "../../../../components/icons/icons";
import {FullFlexContainerClass, RoutePath, UserTokenHeader} from "../../../../util/const";
import {GetLocalUserInfo} from "../../../../util/user";


export default function EmailActivateSendPage() {
  const route = useRouter()
  const lastResendEmailAtKey = "last-resend-email-at"
  const defaultResentWaitTime = 5
  const [retryResendWaitTime, setRetrySendWaiTime] = useState(defaultResentWaitTime)
  const [disableResend, setDisableResent] = useState(false)

  useEffect(()=>{
    if (route.isReady) {
      if (!localStorage.getItem(UserTokenHeader)) {
        route.push(RoutePath.LoginPage)
      }

      let user = GetLocalUserInfo()
      if (user) {
        if (user.user_register_type != "email" || user.email_active) {
          route.push(RoutePath.HomePage)
        }
      }

      let lastResendEmailTime = localStorage.getItem(lastResendEmailAtKey)
      if (lastResendEmailTime) {
        let current = new Date()
        // @ts-ignore
        let timeElapsed = Math.floor(current.getTime() / 1000) - lastResendEmailTime
        if (timeElapsed < defaultResentWaitTime) {
          setDisableResent(true)
          setRetrySendWaiTime(defaultResentWaitTime - timeElapsed)
          let timer = countDownForResend(defaultResentWaitTime - timeElapsed)
          return ()=>{
            clearInterval(timer)
          }
        }
      }
    }
  }, [route.isReady])

  const countDownForResend = (t: number) => {
    let timer = setInterval(()=>{
      if (t == 0) {
        setRetrySendWaiTime(defaultResentWaitTime)
        setDisableResent(false)
        clearInterval(timer)
      } else {
        t = t - 1
        setRetrySendWaiTime(t)
      }
    }, 1000)
    return timer
  }

  const handleResendEmail = () => {
    setDisableResent(true)
    let current = new Date()
    localStorage.setItem(lastResendEmailAtKey, Math.floor(current.getTime() / 1000).toString())
    countDownForResend(defaultResentWaitTime)
    // do resend
    userEmailActivateResend().catch(({err, msg, isAuthFail}) => {
      if (isAuthFail) {
        route.push(RoutePath.LoginPage)
      }
    })
  }

  return (
    <div className={FullFlexContainerClass}>
      <div className="m-auto flex flex-col w-full px-10 space-y-6">
        <EmailIcon className="mx-auto w-32 h-32 mb-2 sm:w-20 sm:h-20"/>
        <p className="text-center">
          An account verify email has been sent to your mailbox, please check the email to activate your account
        </p>
        <button
          className="mx-auto rounded-lg bg-rose-600 p-2 text-amber-50"
          disabled={disableResend}
          onClick={handleResendEmail}
        >
          {!disableResend ? "Email not received, resend" : `Try resend in (${retryResendWaitTime})s`}
        </button>
      </div>
    </div>

  )
}
