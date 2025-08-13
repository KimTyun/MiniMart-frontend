import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import emailReducer from '../features/emailSlice'
import itemReducer from '../features/itemSlice'
import sellerReducer from '../features/sellerSlice'
import mypageReducer from '../features/mypageSlice'
import adminReducer from '../features/adminSlice'
const store = configureStore({
   reducer: {
      auth: authReducer,
      email: emailReducer,
      item: itemReducer,
      seller: sellerReducer,
      mypage: mypageReducer,
      admin: adminReducer,
   },
})

export default store
