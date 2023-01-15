
export enum RoutePath {
  LoginPage = "/login",
  EmailActivatePage = "/user/email/activate",
  EmailActivateSendPage = "/user/email/activate/send",
  HomePage = "/home",
  NewHabitPage = "/habit/new",
  EditHabitPage = "/habit/edit",
}

export const EmailActivateActivateCodeParam = "code"

export const UserTokenHeader = "x-lh-auth"

export const UserLocalStorageKey = "user"

export const HabitIDURLParam = "habit-id"

export const FullFlexContainerClass = "absolute top-0 right-0 bottom-0 left-0 flex"
