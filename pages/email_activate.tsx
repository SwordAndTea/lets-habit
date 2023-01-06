import {useEffect, useState} from "react";
import {LayoutFooterOnly} from "../components/layout/layout";
import {useRouter} from "next/router";
import {userEmailActivateCheck, userEmailActivateResend} from "../api/user";
import {EmailIcon} from "../components/icons/icons";
import {noti} from "../util/noti";


export default function EmailActivatePage() {
  const router = useRouter()
  const uid = router.query.uid ? router.query.uid as string : ""

  useEffect(() => {
    pollEmailActivateState(uid)
  }, []);

  const pollEmailActivateState = (uid: string) => {
    // poll email activated state, if email activated, go to home page
    let failCount = 0
    let successCount = 0
    let timer = setInterval(() => {
      userEmailActivateCheck(uid as string).then((resp) => {
        if (resp && resp.data && resp.data.data && resp.data.data.hasAttribute("activated")) {
          if (resp.data.data.activated) {
            // user email has activated
            clearInterval(timer)
            router.push("/home")
          }
          successCount += 1
          if (successCount == 30) { // stop polling after trying 30 times
            clearInterval(timer)
          }
        }

      }).catch(() => {
        failCount += 1
        if (failCount == 3) {
          clearInterval(timer)
        }
      })
    }, 2000)
  }

  const handleResendEmail = () => {
    userEmailActivateResend(uid)
  }

  return (
    <>
      <div className="flex">
        <div className="m-auto max-w-3xl px-2 sm:max-w-2xl">
          <EmailIcon className="mx-auto w-32 h-32 mb-2 sm:w-20 sm:h-20"/>
          <p className="text-center">
            An account verify email has been sent to your mailbox, please check the email to activate your account
          </p>
          <button
            className="rounded-lg bg-blue-500 mt-2"
            onClick={handleResendEmail}
          >
            Email Not Received, Resend
          </button>
        </div>
      </div>
    </>
  )
}

// @ts-ignore
EmailActivatePage.getLayout = (page) => {
  return <LayoutFooterOnly>{page}</LayoutFooterOnly>
}
