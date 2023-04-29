import {
  EmailActivateActivateCodeParam,
} from "../../../../util/const";
import {userEmailActivate} from "../../../../api/user";
import {GetServerSideProps} from "next";


enum AccountActivateState {
  Success,
  Fail,
}

interface EmailActivatePageProps {
  status: AccountActivateState,
  msg: string
}

export default function EmailActivatePage(props: EmailActivatePageProps) {
  return (
    <div className="m-auto">
      <p className="text-xl">
        {props.status == AccountActivateState.Success && "your account has been activated 👏🥳👏"}
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
