import {component$, useStore} from "@builder.io/qwik";
import {userLoginByEmail} from "~/api/user";

export default component$(() => {

  const state = useStore({
    email: "",
    password: "",
    isSignUp: false,
  })

  return (
    <div class="w-full flex" style={{height: "90vh"}}>
      <div class="m-auto p-16 sm:p-8 w-full max-w-lg rounded-lg shadow-2xl">
        <h1 class="text-center text-2xl font-bold text-blue-400 sm:text-3xl">
          Lets Habit
        </h1>

        <p class="mx-auto mt-4 max-w-md text-center text-gray-500">
          become better may not be a lonely road
        </p>

        <div class="mt-6 mb-0 space-y-4">
          <form class="space-y-4">

            {/* the email input */}
            <div>
              <div className="relative mt-1">
                <label
                  className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    className="peer h-10 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    onInput$={(e: Event) => {
                      // @ts-ignore
                      state.email = e.target.value
                    }}
                  />

                  <span
                    className="absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                  >
                    Email
                  </span>
                </label>
              </div>
            </div>

            {/*the password input*/}
            <div>
              <div className="relative mt-1">
                <label
                  className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                >
                  <input
                    type="password"
                    placeholder="password"
                    className="peer h-10 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    onInput$={(e: Event) => {
                      // @ts-ignore
                      state.password = e.target.value
                    }}
                  />

                  <span
                    className="absolute left-3 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                  >
                    Password
                  </span>
                </label>
              </div>
            </div>
          </form>
          <button
            type="submit"
            className="block w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
            onClick$={() => {
              if (state.email === "") {
                alert("email empty")
                return
              }
              if (state.password === "") {
                alert("empty password")
                return
              }
              if (state.isSignUp) {
                //TODO: complete sign up
              } else {
                userLoginByEmail(state.email, state.password).then((resp) => {
                  console.log("success", resp)
                  //TODO: handle response
                }).catch((err) => {
                  if (err.response != null && err.response.data != null && err.response.data.meta != null) {
                    alert(`${err.response.status} ${err.response.data.meta.message}`)
                  } else {
                    alert(`${err.message}`)
                  }
                })
              }
            }}
          >
            {state.isSignUp ? "Sign up" : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-500">
            {state.isSignUp ? (
              <>
                Already have an account?
                <button className="underline" onClick$={() => {
                  state.isSignUp = false
                }}>Sign in</button>
              </>
            ) : (
              <>
                No account?
                <button className="underline" onClick$={() => {
                  state.isSignUp = true
                }}>Sign up</button>
              </>
            )}

          </p>
        </div>
      </div>
    </div>
  )
})
