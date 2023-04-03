import {userLoginByEmail, userPing, userRegisterByEmail} from "../api/user";
import React, {useState} from "react";
import {LayoutFooterOnly} from "../components/layout/layout";
import {NextRouter, useRouter} from "next/router";
import {noti} from "../util/noti";
import {SpinWaitIndicatorIcon, WeChatIcon} from "../components/icons";
import {RoutePath} from "../util/const";
import {AxiosResponse} from "axios";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [disableSignInSignUp, setDisableSignInSignUp] = useState(false);

  const route = useRouter()

  const handleUserResp = (resp: AxiosResponse, route: NextRouter) => {
    localStorage.setItem("user", JSON.stringify(resp.data.data.user))
    if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
      route.push(RoutePath.EmailActivateSendPage)
    } else {
      route.push(RoutePath.HomePage)
    }
  }

  const handleEmailSignUpLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (email === "") {
      noti.error("empty email")
      return
    }
    if (password === "") {
      noti.error("empty password")
      return
    }
    if (isSignUp) {
      // do sign up
      setDisableSignInSignUp(true)
      userRegisterByEmail(email, password).then((resp) => {
        handleUserResp(resp, route)
      }).finally(() => {
        setDisableSignInSignUp(false)
      })
    } else {
      // do sign in
      setDisableSignInSignUp(true)
      userLoginByEmail(email, password).then((resp) => {
        handleUserResp(resp, route)
      }).finally(() => {
        setDisableSignInSignUp(false)
      })
    }
  }

  return (
    <div className="mx-auto my-12 p-16 sm:p-8 w-full max-w-lg rounded-lg shadow-2xl bg-white">
      {/*title*/}
      <h1 className="text-center text-2xl font-bold sm:text-3xl">
        Lets Habit
      </h1>
      {/*subtitle*/}
      <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
        become better may not be a lonely road
      </p>
      {/**/}
      <div className="mt-6 mb-0 space-y-4">
        <form className="space-y-4">
          {/* the email input */}
          <div className="relative mt-1">
            <label
              htmlFor="UserEmail"
              className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <input
                id="UserEmail"
                type="email"
                placeholder="Email"
                className="peer h-10 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />

              <span
                className="absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
              >
                  Email
                </span>
            </label>
          </div>

          {/*the password input*/}
          <div className="relative mt-1">
            <label
              htmlFor="UserPassword"
              className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
            >
              <input
                id="UserPassword"
                type="password"
                placeholder="password"
                className="peer h-10 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />

              <span
                className="absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
              >
                  Password
                </span>
            </label>
          </div>

          {/*sign in / sign up button*/}
          <button
            type="submit"
            className={`block flex justify-center w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white`}
            onClick={handleEmailSignUpLogin}
            disabled={disableSignInSignUp}
          >
            {disableSignInSignUp ? (
              <>
                <SpinWaitIndicatorIcon className="w-5 h-5 mr-3"/>
                {isSignUp ? "Signing up" : "Signing in"}
              </>
            ) : (isSignUp ? "Sign up" : "Sign in")}
          </button>

        </form>



        {/*sign in / sign up switch info*/}
        <p className="text-center text-sm text-gray-500">
          {isSignUp ? (
            <>
              Already have an account?
              <button
                className="underline"
                onClick={() => {
                  setIsSignUp(false)
                }}
                disabled={disableSignInSignUp}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              No account?
              <button
                className="underline"
                onClick={() => {
                  setIsSignUp(true)
                }}
                disabled={disableSignInSignUp}
              >
                Sign up
              </button>
            </>
          )}
        </p>

        <div className="pt-2">
          {/*other login type separate line*/}
          <div className="flex relative">
            <div className="w-full h-[1px] m-auto bg-[rgba(0,0,0,0.3)]"/>
            <span
              className="px-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-sm text-[rgba(0,0,0,0.3)]"
            >
            or login with
          </span>
          </div>

          <div className="flex mt-6">
            <button className="mx-auto">
              <WeChatIcon width="20" height="20" className="fill-black"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// @ts-ignore
Login.getLayout = (page) => {
  return <LayoutFooterOnly>{page}</LayoutFooterOnly>
}

export async function getServerSideProps(context: object) {
  // @ts-ignore
  return await userPing(context.req.headers.cookie).then(() => {
    return {
      redirect: {
        destination: RoutePath.HomePage,
        permanent: false,
      }
    }
  }).catch(()=>{
    return {props: {}}
  })
}
