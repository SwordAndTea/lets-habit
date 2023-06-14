import {LayoutFooterOnly} from "../../../components/layout/layout";
import React, {ReactNode, useState} from "react";
import {resetPassword, sendResetPasswordVerifyCode} from "../../../api/user";
import {useRouter} from "next/router";
import {noti} from "../../../util/noti";
import {RoutePath} from "../../../util/const";
import {IsEmail} from "../../../util/basic";

interface InputWrapperProps {
  id: string
  name: string
  type?:  React.HTMLInputTypeAttribute
  onInputChange?: React.ChangeEventHandler<HTMLInputElement>
}

function InputWrapper(props: InputWrapperProps) {
  return (
    <div>
      <label htmlFor={props.id} className="font-medium text-gray-700">{props.name}</label>
      <input id={props.id} type={props.type ? props.type : "text"} className="common-input" onChange={props.onInputChange}/>
    </div>
  )
}

export default function PasswordReset() {
  const route = useRouter()

  const [email, setEmail] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [canSendVerifyCode, setCanSendVerifyCode] = useState(false)

  const handleSendVerifyCode = () => {
    if (!IsEmail(email)) {
      noti.warning("invalid email format")
      return
    }
    sendResetPasswordVerifyCode(email).then(() => {
      noti.success("send success")
    })
  }

  const handleResetPassword = () => {
    if (newPassword != confirmNewPassword) {
      noti.warning("confirm password is not the some with new password")
      return
    }
    resetPassword(email, verifyCode, newPassword).then(()=>{
      noti.success("reset password success, please login")
      setTimeout(()=>{
        route.replace(RoutePath.LoginPage)
      }, 2000)
    })
  }

  return (
    <div className="flex w-full">
      <form className="m-auto space-y-4 w-1/2">
        <h1 className="text-center font-medium text-3xl text-gray-600">Reset Password</h1>
        <InputWrapper id="email" name="email" onInputChange={(e) => {
          setCanSendVerifyCode(IsEmail(e.target.value))
          setEmail(e.target.value)
        }}/>
        <div>
          <label htmlFor="verify-code" className="font-medium text-gray-700">verify code</label>
          <div className="flex">
            <input
              id="verify-code"
              type="text"
              className="common-input"
              onChange={(e) => {
                setVerifyCode(e.target.value)
              }}
            />
            <button
              type="button"
              className={`${canSendVerifyCode ? "bg-cyan-500": "bg-gray-400"} text-white rounded-lg w-48 h-11 ml-2`}
              onClick={handleSendVerifyCode}
              disabled={!canSendVerifyCode}
            >
              Send Verify Code
            </button>
          </div>
        </div>

        <InputWrapper id="new-password" name="new password" type="password" onInputChange={(e) => {
          setNewPassword(e.target.value)
        }
        }/>
        <InputWrapper id="confirm-new-password" name="confirm new password" type="password" onInputChange={(e) => {
          setConfirmNewPassword(e.target.value)
        }}/>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="alter-btn w-24 h-10"
            onClick={() => {
              route.back()
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn w-24 h-10"
            onClick={handleResetPassword}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  )
}

PasswordReset.getLayout = (page: ReactNode) => {
  return <LayoutFooterOnly>{page}</LayoutFooterOnly>
}
