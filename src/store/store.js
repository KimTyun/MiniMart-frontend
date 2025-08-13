import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import emailReducer from '../features/emailSlice'
import itemReducer from '../features/itemSlice'
import mypageReducer from '../features/mypageSlice'
import followReducer from '../features/followSlice'
const store = configureStore({
   reducer: {
      auth: authReducer,
      email: emailReducer,
      item: itemReducer,
      mypage: mypageReducer,
      follow: followReducer,
   },
})

export default store
