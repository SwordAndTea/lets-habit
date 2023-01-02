import {SVGProps, useEffect, useState} from "react";
import {LayoutFooterOnly} from "../components/layout/layout";
import {CommonMinHeight} from "./const";
import {useRouter} from "next/router";
import {userEmailActivateCheck, userEmailActivateResend} from "../api/user";
import {noti} from "../util/noti";

function EmailIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" {...props}>
      {/*<!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->*/}
      <path
        d="M96 0C78.3 0 64 14.3 64 32V224h96V192c0-35.3 28.7-64 64-64H448V32c0-17.7-14.3-32-32-32H96zM224 160c-17.7 0-32 14.3-32 32v32h96c35.3 0 64 28.7 64 64V416H544c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32H224zm240 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zM32 256c-17.7 0-32 14.3-32 32v13L155.1 415.9c1.4 1 3.1 1.6 4.9 1.6s3.5-.6 4.9-1.6L320 301V288c0-17.7-14.3-32-32-32H32zm288 84.8L184 441.6c-6.9 5.1-15.3 7.9-24 7.9s-17-2.8-24-7.9L0 340.8V480c0 17.7 14.3 32 32 32H288c17.7 0 32-14.3 32-32V340.8z"/>
    </svg>
  )
}

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
      <div className={`${CommonMinHeight} flex`}>
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