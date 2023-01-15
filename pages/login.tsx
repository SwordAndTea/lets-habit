import {getUserInfo, userLoginByEmail, userRegisterByEmail} from "../api/user";
import {useEffect, useState} from "react";
import {LayoutFooterOnly} from "../components/layout/layout";
import {useRouter} from "next/router";
import {noti} from "../util/noti";
import {WeChatIcon} from "../components/icons/icons";
import {RoutePath, UserTokenHeader} from "../util/const";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [disableSignInSignUp, setDisableSignInSignUp] = useState(false);

  const route = useRouter()

  useEffect(() => {
    if (route.isReady && localStorage.getItem(UserTokenHeader)) {
      getUserInfo().then(() => {
        route.push(RoutePath.HomePage)
      })
    }
  }, [route.isReady])

  const handleEmailSignUpLogin = () => {
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
        if (resp.data && resp.data.data && resp.data.data.user && resp.headers && resp.headers[UserTokenHeader]) {
          localStorage.setItem("user", JSON.stringify(resp.data.data.user))
          localStorage.setItem(UserTokenHeader, resp.headers[UserTokenHeader])
          route.push(RoutePath.EmailActivateSendPage)
        } else {
          noti.error("can not parse sign up return data")
        }
      }).finally(() => {
        setDisableSignInSignUp(false)
      })
    } else {
      // do sign in
      setDisableSignInSignUp(true)
      userLoginByEmail(email, password).then((resp) => {
        if (resp.data && resp.data.data && resp.data.data.user && resp.headers && resp.headers[UserTokenHeader]) {
          localStorage.setItem("user", JSON.stringify(resp.data.data.user))
          localStorage.setItem(UserTokenHeader, resp.headers[UserTokenHeader])
          if (resp.data.data.user.user_register_type == "email" && !resp.data.data.user.email_active) {
            route.push(RoutePath.EmailActivateSendPage)
          } else {
            route.push(RoutePath.HomePage)
          }
        } else {
          noti.error("unable to parse login return data")
        }
      }).finally(() => {
        setDisableSignInSignUp(false)
      })
    }
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 flex">
      <div className="m-auto p-16 sm:p-8 w-full max-w-lg rounded-lg shadow-2xl">
        {/*title*/}
        <h1 className="text-center text-2xl font-bold text-blue-400 sm:text-3xl">
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
              className={`block flex justify-center w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white`}
              onClick={handleEmailSignUpLogin}
              disabled={disableSignInSignUp}
            >
              {disableSignInSignUp ? (
                <>
                  {/*the loading indicator*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {isSignUp ? "Signing up" : "Signing in"}
                </>
              ) : (<>{isSignUp ? "Sign up" : "Sign in"}</>)}
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
                <WeChatIcon width="20" height="20" className="fill-slate-800"/>
              </button>
            </div>
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
