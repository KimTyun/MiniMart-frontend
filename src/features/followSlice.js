import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import minimartApi from '../api/axiosApi'

// 1. (홈페이지용) 팔로잉 목록 불러오기 Thunk
export const fetchFollowingSellersThunk = createAsyncThunk('follow/fetchFollowing', async (_, { rejectWithValue }) => {
   try {
      const response = await minimartApi.get('/api/follow/home')
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response.data)
   }
})

// 2. 팔로우하기 Thunk
export const followSellerThunk = createAsyncThunk('follow/followSeller', async (sellerId, { rejectWithValue }) => {
   try {
      const response = await minimartApi.post(`/api/follow/seller/${sellerId}`)
      return { sellerId, ...response.data }
   } catch (error) {
      return rejectWithValue(error.response.data)
   }
})

// 3. 언팔로우하기 Thunk
export const unfollowSellerThunk = createAsyncThunk('follow/unfollowSeller', async (sellerId, { rejectWithValue }) => {
   try {
      await minimartApi.delete(`/api/follow/seller/${sellerId}`)
      return { sellerId } // 성공 시 sellerId를 반환하여 상태 업데이트에 사용
   } catch (error) {
      return rejectWithValue(error.response.data)
   }
})

const followSlice = createSlice({
   name: 'follow',
   initialState: {
      followingList: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 팔로잉 목록 불러오기
         .addCase(fetchFollowingSellersThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(fetchFollowingSellersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.followingList = action.payload
         })
         .addCase(fetchFollowingSellersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 언팔로우 성공 시
         .addCase(unfollowSellerThunk.fulfilled, (state, action) => {
            // 목록에서 해당 판매자를 제거합니다.
            state.followingList = state.followingList.filter((seller) => seller.id !== action.payload.sellerId)
         })
   },
})

export default followSlice.reducer
