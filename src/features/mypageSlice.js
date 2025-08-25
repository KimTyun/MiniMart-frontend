import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateMyPage, unfollowSeller, cancelOrder, writeReview, getSeller } from '../api/mypageApi'
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
      console.error('정보 수정 중 에러 발생:', err.response)
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
export const createReviewThunk = createAsyncThunk('mypage/createReview', async (reviewData, { rejectWithValue }) => {
   try {
      const response = await writeReview(reviewData)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || '알 수 없는 오류')
   }
})

// 판매자 신청
export const getSellerThunk = createAsyncThunk('mypage/getSeller', async (_, { rejectWithValue }) => {
   try {
      const response = await getSeller()
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '페이지를 불러오는데 실패했습니다.')
   }
})

//프사 변경
export const updateProfilePicThunk = createAsyncThunk('mypage/updateProfilePic', async (formData, { rejectWithValue }) => {
   try {
      const response = await minimartApi.post('/mypage/uploads/profile-images', formData, {
         withCredentials: true,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
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
      seller: null,
      status: 'idle',
      reviewStatus: 'idle',
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 내 정보 불러오기
         .addCase(fetchMyPageThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMyPageThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.data.user
            state.orders = action.payload.data.orders
            state.followings = action.payload.data.followings
            state.error = null
         })
         .addCase(fetchMyPageThunk.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload || action.error.message
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
            state.reviewStatus = 'loading'
         })
         .addCase(createReviewThunk.fulfilled, (state, action) => {
            state.loading = false
            state.reviewStatus = 'succeeded'
            state.orders = state.orders.map((order) => (order.orderId === action.payload.orderId ? { ...order, hasReview: true } : order))
         })
         .addCase(createReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.reviewStatus = 'failed'
            state.error = action.payload
         })
         // 판매자?
         .addCase(getSellerThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getSellerThunk.fulfilled, (state, action) => {
            state.loading = false
            state.seller = action.payload.seller
         })
         .addCase(getSellerThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 프사 변경
         .addCase(updateProfilePicThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateProfilePicThunk.fulfilled, (state, action) => {
            state.loading = false
            if (state.user) {
               state.user.profile_img = action.payload.url
            }
         })
         .addCase(updateProfilePicThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { actions, reducer } = mypageSlice
export default reducer
