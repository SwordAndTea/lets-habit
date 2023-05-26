import {combineReducers} from 'redux'
import {reducer as notificationsReducer} from 'reapop'
import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {InitialUser, User} from "./user";

const initialState = {user: InitialUser}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set(state, action: PayloadAction<User>) {
      // @ts-ignore
      state.user = action.payload
    },
  },
})

const rootReducer = combineReducers({
  notifications: notificationsReducer(),
  [userSlice.name]: userSlice.reducer
})

const store = configureStore({
  reducer: rootReducer
})

export type RootState = ReturnType<typeof store.getState>;

export default store

