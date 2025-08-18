import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import emailReducer from '../features/emailSlice'
import itemReducer from '../features/itemSlice'
import sellerReducer from '../features/sellerSlice'
import mypageReducer from '../features/mypageSlice'
import followReducer from '../features/followSlice'
import adminReducer from '../features/adminSlice'
import reviewReducer from '../features/reviewSlice'
import orderReducer from '../features/orderSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      email: emailReducer,
      item: itemReducer,
      seller: sellerReducer,
      mypage: mypageReducer,
      follow: followReducer,
      admin: adminReducer,
      review: reviewReducer,
      order: orderReducer,
   },
})

export default store
