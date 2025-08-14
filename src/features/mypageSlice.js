import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateMyPage, unfollowSeller, cancelOrder } from '../api/mypageApi'
import minimartApi from '../api/axiosApi'

// // 환경 변수를 사용하여 mock 데이터 사용 여부 결정
// const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// // 가상 주문정보 및 팔로워. 제출 시 삭제
// import { getOrderHistory, getFollowedSellers } from '../mocks/fakeapi'

// 내 정보 불러오기
export const fetchMyPageThunk = createAsyncThunk('mypage/fetchMyPage', async (_, thunkAPI) => {
   try {
      const response = await minimartApi.get('/mypage')
      return response.data
   } catch (err) {
      console.error('fetchMyPageThunk 에러:', err.response)
      return thunkAPI.rejectWithValue(err.response?.data?.message || '불러오기 실패')
   }
})

//주문내역
export const fetchOrderHistoryThunk = createAsyncThunk('mypage/fetchOrderHistory', async (_, thunkAPI) => {
   try {
      const response = await minimartApi.get('/orders')
      return response.data
   } catch (err) {
      console.error('fetchOrderHistoryThunk 에러:', err.response)
      return thunkAPI.rejectWithValue(err.response?.data?.message || '주문 내역 불러오기 실패')
   }
})

//팔로우한 판매자 목록
export const fetchFollowedSellersThunk = createAsyncThunk('mypage/fetchFollowedSellers', async (_, thunkAPI) => {
   //Mocks이용한 가상 팔로워 목록. 나중에 제출 시 이 주석 블록 전체 삭제
   // if (USE_MOCK_DATA) {
   //    console.log('--- [개발용] Mock 데이터로 팔로잉 목록 가져오기 ---')
   //    try {
   //       const response = await getFollowedSellers()
   //       return response.data
   //    } catch (err) {
   //       return thunkAPI.rejectWithValue(err.message || '개발용 팔로잉 목록 불러오기 실패')
   //    }
   // }
   // //여기까지 드래그하고 삭제

   //팔로우한 판매자 목록
   try {
      const response = await minimartApi.get('/mypage/followings')
      return response.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || '팔로잉 목록 불러오기 실패')
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

//주문취소
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
            state.error = null
         })
         .addCase(fetchMyPageThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMyPageThunk.rejected, (state, action) => {
            state.loading = false
            state.user = null
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
         // 주문내역
         .addCase(fetchOrderHistoryThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchOrderHistoryThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = action.payload
         })
         .addCase(fetchOrderHistoryThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //주문취소
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
         // 팔로우한 판매자 목록
         .addCase(fetchFollowedSellersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchFollowedSellersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.followings = action.payload
         })
         .addCase(fetchFollowedSellersThunk.rejected, (state, action) => {
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
   },
})

export const { actions, reducer } = mypageSlice
export default reducer
