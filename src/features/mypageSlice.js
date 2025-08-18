import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateMyPage, unfollowSeller, writeReview } from '../api/mypageApi'
import minimartApi from '../api/axiosApi'

// dummyDb는 가상의 주문내역과 팔로워입니다. 이 부분을 보강하거나, 실제 제출 시엔 삭제하고 DB에 저장된 값 불러오는 거 테스트햐봐야 합니다.
const dummyDb = {
   orders: [
      {
         orderId: 'ORD001',
         date: '2023.10.26',
         status: 'DELIVERED',
         hasReview: false,
         seller: { id: 'seller_1', name: '빵순이네', avatarUrl: 'https://placehold.co/50x50/ffc0cb/000000?text=빵' },
         items: [
            { itemId: 1, name: '프리미엄 커피 원두 200g', imageUrl: 'https://placehold.co/150x150/f0d85a/000000?text=Coffee' },
            { itemId: 2, name: '수제 마카롱 세트', imageUrl: 'https://placehold.co/150x150/f0d85a/000000?text=Macaron' },
         ],
      },
      {
         orderId: 'ORD002',
         date: '2023.10.24',
         status: 'PAID', // 이 주문을 취소할 예정
         hasReview: false,
         seller: { id: 'seller_2', name: '커피의 정석', avatarUrl: 'https://placehold.co/50x50/a9a9a9/ffffff?text=C' },
         items: [{ itemId: 3, name: '유기농 수제잼', imageUrl: 'https://placehold.co/150x150/f0d85a/000000?text=Jam' }],
      },
   ],
   followings: [
      { id: 'seller_1', name: '빵순이네', avatarUrl: 'https://placehold.co/50x50/ffc0cb/000000?text=빵' },
      { id: 'seller_2', name: '커피의 정석', avatarUrl: 'https://placehold.co/50x50/a9a9a9/ffffff?text=C' },
   ],
}

// 내 정보 불러오기
export const fetchMyPageThunk = createAsyncThunk('mypage/fetchMyPage', async () => {
   // 실제 API 호출 대신 더미 데이터를 Promise로 반환하여 비동기 상황을 시뮬레이션
   return Promise.resolve(dummyDb)
})

// 내 정보 불러오기
// export const fetchMyPageThunk = createAsyncThunk('mypage/fetchMyPage', async (_, { rejectWithValue }) => {
//    try {
//       const response = await minimartApi.get('/mypage', { withCredentials: true })
//       return response.data
//    } catch (err) {
//       return rejectWithValue(err.response?.data || err.message)
//    }
// })

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

// 더미 주문취소
export const cancelOrderThunk = createAsyncThunk('mypage/cancelOrder', async (orderId, { rejectWithValue }) => {
   try {
      // 전달받은 orderId를 콘솔에 출력하여 확인합니다.
      console.log('Attempting to cancel order with ID:', orderId)

      // 더미 데이터에서 해당 주문을 찾습니다.
      const order = dummyDb.orders.find((o) => o.orderId === orderId)

      // 찾은 주문의 상태를 확인합니다.
      console.log('Found order status:', order?.status)

      // 주문이 존재하지 않거나, 이미 배송 완료된 주문이라면 실패를 시뮬레이션합니다.
      if (!order || order.status === 'DELIVERED') {
         // 이 블록이 실행될 때도 콘솔에 로그를 남깁니다.
         console.log('Rejection condition met for order:', orderId, ' - Rejecting thunk.')
         return rejectWithValue({ message: '주문을 찾을 수 없거나 이미 배송이 시작되어 취소할 수 없습니다.' })
      }

      // 더미 데이터를 직접 수정하는 대신, 성공 응답을 반환하여 리듀서에서 상태를 변경하게 합니다.
      return Promise.resolve({ message: '주문이 성공적으로 취소되었습니다.', orderId })
   } catch (err) {
      console.error('An unexpected error occurred during order cancellation:', err)
      return rejectWithValue({ message: '주문 취소 실패' })
   }
})

// // 주문취소
// export const cancelOrderThunk = createAsyncThunk('mypage/cancelOrder', async (orderId, thunkAPI) => {
//    try {
//       const response = await cancelOrder(orderId)
//       return response.data
//    } catch (error) {
//       console.error('cancelOrderThunk 에러:', error.response)
//       return thunkAPI.rejectWithValue(error.response?.data?.message || '주문 취소 실패')
//    }
// })

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
      return { ...response.data, orderId: reviewData.orderId }
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
      reviewStatus: null,
      status: 'idle',
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 더미 내 정보 불러오기 (fetchMyPageThunk)
         .addCase(fetchMyPageThunk.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(fetchMyPageThunk.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // 당신의 dummyDb 구조에 맞게 수정
            state.orders = action.payload.orders
            state.followings = action.payload.followings
         })
         .addCase(fetchMyPageThunk.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload || action.error.message
         })
         // // 내 정보 불러오기
         // .addCase(fetchMyPageThunk.pending, (state) => {
         //    state.loading = true
         //    state.error = null
         // })
         // .addCase(fetchMyPageThunk.fulfilled, (state, action) => {
         //    state.loading = false
         //    state.user = action.payload
         //    state.orders = action.payload.orders
         //    state.followings = action.payload.followings
         //    state.error = null
         // })
         // .addCase(fetchMyPageThunk.rejected, (state, action) => {
         //    state.status = 'failed'
         //    state.error = action.payload || action.error.message
         // })
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
         // 더미 주문취소
         .addCase(cancelOrderThunk.pending, (state) => {
            state.status = 'loading'
         })
         .addCase(cancelOrderThunk.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // 불변성을 지키기 위해 map을 사용하여 새로운 배열을 반환합니다.
            const updatedOrders = state.orders.map((order) =>
               order.orderId === action.payload.orderId
                  ? { ...order, status: 'CANCELED' } // 새로운 객체를 만들어 상태를 변경
                  : order
            )
            state.orders = updatedOrders
         })
         .addCase(cancelOrderThunk.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload?.message || action.error.message
         })
         // // 주문취소
         // .addCase(cancelOrderThunk.pending, (state) => {
         //    state.loading = true
         //    state.error = null
         // })
         // .addCase(cancelOrderThunk.fulfilled, (state, action) => {
         //    state.loading = false
         //    state.error = null
         //    state.orders = state.orders.map((order) => (order.orderId === action.meta.arg ? { ...order, status: 'CANCELED' } : order))
         // })
         // .addCase(cancelOrderThunk.rejected, (state, action) => {
         //    state.loading = false
         //    state.error = action.payload
         // })
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
         })
         .addCase(createReviewThunk.fulfilled, (state, action) => {
            state.loading = false
            state.orders = state.orders.map((order) => (order.orderId === action.payload.orderId ? { ...order, hasReview: true } : order))
         })
         .addCase(createReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { actions, reducer } = mypageSlice
export default reducer
