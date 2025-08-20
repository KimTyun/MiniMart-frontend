import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import emailReducer from '../features/emailSlice'
import itemReducer from '../features/itemSlice'
import sellerReducer from '../features/sellerSlice'
import mypageReducer from '../features/mypageSlice'
import followReducer from '../features/followSlice'
import adminReducer from '../features/adminSlice'
import orderReducer from '../features/orderSlice'
import searchReducer from '../features/searchSlice'

const store = configureStore({
   reducer: {
      auth: authReducer,
      email: emailReducer,
      item: itemReducer,
      seller: sellerReducer,
      mypage: mypageReducer,
      follow: followReducer,
      admin: adminReducer,
      order: orderReducer,
      search: searchReducer,
   },
})

export default store
