import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice'
import emailReducer from '../features/emailSlice'
import itemReducer from '../features/itemSlice'
import sellerReducer from '../features/sellerSlice'
import mypageReducer from '../features/mypageSlice'
<<<<<<< HEAD
import followReducer from '../features/followSlice'
=======
import adminReducer from '../features/adminSlice'
>>>>>>> 5120e062e9acef8726b095a8ee3da1d0ba2888b5
const store = configureStore({
   reducer: {
      auth: authReducer,
      email: emailReducer,
      item: itemReducer,
      seller: sellerReducer,
      mypage: mypageReducer,
<<<<<<< HEAD
      follow: followReducer,
=======
      admin: adminReducer,
>>>>>>> 5120e062e9acef8726b095a8ee3da1d0ba2888b5
   },
})

export default store
