import {
  EmailActivateActivateCodeParam, RoutePath,
} from "../../../../util/const";
import {userEmailActivate} from "../../../../api/user";
import {GetServerSideProps} from "next";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";


enum AccountActivateState {
  Success,
  Fail,
}

interface EmailActivatePageProps {
  status: AccountActivateState,
  msg: string
}

export default function EmailActivatePage(props: EmailActivatePageProps) {
  const [pageRedirectRemainTime, setPageRedirectRemainTime] = useState(5)
  const route = useRouter()

  const countDownAndRedirect = () => {
    let remainTime = pageRedirectRemainTime
    let i = setInterval(() => {
      if (remainTime <= 0) {
        clearInterval(i)
        route.replace({
          pathname: RoutePath.HomePage,
          query: {"page": 1},
        })
        return
      }
      remainTime -= 1
      setPageRedirectRemainTime(remainTime)
    }, 1000)
  }

  useEffect(() => {
    if (props.status == AccountActivateState.Success) {
      countDownAndRedirect()
    }
  }, [])

  return (
    <div className="m-auto">
      <p className="text-xl">
        {props.status == AccountActivateState.Success && `your account has been activated 👏🥳👏, will go to home page in ${pageRedirectRemainTime} seconds`}
        {props.status == AccountActivateState.Fail && `oops, activate failed, ${props.msg} 🤔`}
      </p>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  let activateCode = context.query[EmailActivateActivateCodeParam]
  if (activateCode) {
    return await userEmailActivate(activateCode as string).then(() => {
      return {
        props: {
          status: AccountActivateState.Success,
          msg: ""
        }
      }
    }).catch(({msg}) => {
      return {
        props: {
          status: AccountActivateState.Fail,
          msg: msg
        }
      }
    })
  }
  return {
    props: {
      status: AccountActivateState.Fail,
      msg: "no activate code found"
    }
  }
}
