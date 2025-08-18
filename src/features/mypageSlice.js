import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateMyPage, unfollowSeller, cancelOrder, writeReview } from '../api/mypageApi'
import minimartApi from '../api/axiosApi'

// 내 정보 불러오기
export const fetchMyPageThunk = createAsyncThunk('mypage/fetchMyPage', async (_, { rejectWithValue }) => {
   try {
      const response = await minimartApi.get('/mypage', { withCredentials: true })
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
   }
})

// 내 정보 수정
export const updateMyPageThunk = createAsyncThunk('mypage/updateMyPage', async (formData, thunkAPI) => {
   try {
      const res = await updateMyPage(formData)
      return res.data
   } catch (err) {
      console.error('updateMyPageThunk error response:', err.response)
      return thunkAPI.rejectWithValue(err.response?.data || '수정 실패')
   }
})

// 회원 탈퇴
export const deleteAccountThunk = createAsyncThunk('mypage/deleteAccount', async (_, { rejectWithValue }) => {
   try {
      const response = await minimartApi.delete('/mypage/delete')
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
   }
})

// 주문취소
export const cancelOrderThunk = createAsyncThunk('mypage/cancelOrder', async (orderId, thunkAPI) => {
   try {
      const response = await cancelOrder(orderId)
      return response.data
   } catch (error) {
      console.error('cancelOrderThunk 에러:', error.response)
      return thunkAPI.rejectWithValue(error.response?.data?.message || '주문 취소 실패')
   }
})

// 팔로잉 취소 (sellerId 받음)
export const unfollowSellerThunk = createAsyncThunk('mypage/unfollowSeller', async (sellerId, thunkAPI) => {
   try {
      const res = await unfollowSeller(sellerId)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || '팔로잉 취소 실패')
   }
})
// 리뷰 작성
export const createReviewThunk = createAsyncThunk('mypage/createReview', async (reviewData, thunkAPI) => {
   try {
      const response = await writeReview(reviewData)
      return response
   } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '리뷰 작성 실패')
   }
})

const mypageSlice = createSlice({
   name: 'mypage',
   initialState: {
      user: null,
      orders: [],
      followings: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 내 정보 불러오기
         .addCase(fetchMyPageThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.orders = action.payload.orders
            state.followings = action.payload.followings
            state.error = null
         })
         .addCase(fetchMyPageThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMyPageThunk.rejected, (state, action) => {
            state.loading = false
            state.user = null
            state.orders = []
            state.followings = []
            state.error = action.payload
         })
         // 회원정보 수정
         .addCase(updateMyPageThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateMyPageThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user
         })
         .addCase(updateMyPageThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 회원 탈퇴
         .addCase(deleteAccountThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(deleteAccountThunk.fulfilled, (state) => {
            state.loading = false
            state.user = null
         })
         .addCase(deleteAccountThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 주문취소
         .addCase(cancelOrderThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.orders = state.orders.map((order) => (order.orderId === action.meta.arg ? { ...order, status: 'CANCELED' } : order))
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 팔로잉 취소
         .addCase(unfollowSellerThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(unfollowSellerThunk.fulfilled, (state, action) => {
            state.loading = false
            if (state.user) {
               state.user.followings = state.user.followings.filter((seller) => seller.id !== action.meta.arg)
            }
         })
         .addCase(unfollowSellerThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //리뷰 작성
         .addCase(createReviewThunk.pending, (state) => {
            state.loading = true
            state.error = null
            state.success = false
         })
         .addCase(createReviewThunk.fulfilled, (state) => {
            state.loading = false
            state.success = true
         })
         .addCase(createReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.success = false
         })
   },
})

export const { actions, reducer } = mypageSlice
export default reducer
