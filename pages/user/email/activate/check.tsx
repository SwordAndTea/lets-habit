import {useEffect, useState} from "react";
import {LayoutFooterOnly} from "../../../../components/layout/layout";
import {useRouter} from "next/router";
import {userEmailActivateCheck, userEmailActivateResend} from "../../../../api/user";
import {EmailIcon} from "../../../../components/icons/icons";
import {noti} from "../../../../util/noti";
import {EmailActivatePollTokenParam} from "../../../../util/const";


export default function EmailActivateCheckPage() {
  const route = useRouter()
  const [pollToken, setPollToken] = useState("")

  useEffect(() => {
    if (route.isReady) {
      let thePollToken = route.query[EmailActivatePollTokenParam] ? route.query[EmailActivatePollTokenParam] as string : ""
      setPollToken(thePollToken)
      const timer = pollEmailActivateState(thePollToken)
      return ()=>{
        clearInterval(timer)
      }
    }
  }, [route.isReady]);

  const pollEmailActivateState = (pollToken: string) => {
    // poll email activated state, if email activated, go to home page
    let failCount = 0
    let successCount = 0
    let timer = setInterval(() => {
      userEmailActivateCheck(pollToken).then((resp) => {
        if (resp.data && resp.data.data && resp.data.data.hasOwnProperty("activated")) {
          if (resp.data.data.activated) {
            // user email has activated
            clearInterval(timer)
            route.push("/home")
          }
          successCount += 1
          if (successCount == 30) { // stop polling after trying 30 times
            clearInterval(timer)
          }
        } else {
          noti.error("unable to process return api data")
          clearInterval(timer)
        }
      }).catch(() => {
        failCount += 1
        if (failCount == 2) {
          clearInterval(timer)
        }
      })
    }, 2500)
    return timer
  }

  const handleResendEmail = () => {
    userEmailActivateResend(pollToken)
  }

  return (
    <div className="m-auto flex flex-col w-full px-10 space-y-6">
      <EmailIcon className="mx-auto w-32 h-32 mb-2 sm:w-20 sm:h-20"/>
      <p className="text-center">
        An account verify email has been sent to your mailbox, please check the email to activate your account
      </p>
      <button
        className="mx-auto rounded-lg bg-rose-500 p-2 text-amber-50"
        onClick={handleResendEmail}
      >
        Email Not Received, Resend
      </button>
    </div>
  )
}

// @ts-ignore
EmailActivateCheckPage.getLayout = (page) => {
  return <LayoutFooterOnly>{page}</LayoutFooterOnly>
}
