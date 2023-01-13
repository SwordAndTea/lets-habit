import {combineReducers} from 'redux'
import {reducer as notificationsReducer} from 'reapop'
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  notifications: notificationsReducer(),
})
export default configureStore({
  reducer: rootReducer
})