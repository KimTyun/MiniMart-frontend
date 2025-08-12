import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMyPage, updateMyPage, writeReview, unfollowSeller } from '../api/mypageApi'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

// 내 정보 불러오기
export const fetchMyPageThunk = createAsyncThunk('mypage/fetchMyPage', async (url, thunkAPI) => {
   try {
      const token = localStorage.getItem('token')
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
         },
      }) // 응답이 성공적인지 확인

      if (!response.ok) {
         const errorText = await response.text()
         throw new Error(errorText || '불러오기 실패')
      }

      const data = await response.json()
      return data
   } catch (err) {
      // 에러 핸들링을 강화
      console.error('fetchMyPageThunk 에러:', err)
      return thunkAPI.rejectWithValue(err.message || '불러오기 실패')
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
      const token = localStorage.getItem('token')
      const response = await axios.delete(`${API_BASE_URL}/mypage/delete`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      })
      return response.data // 성공 메시지를 반환
   } catch (error) {
      return rejectWithValue(error.response.data.message || error.message)
   }
})

// 리뷰 작성 (orderId와 리뷰 내용 받음)
export const writeReviewThunk = createAsyncThunk('mypage/writeReview', async ({ orderId, reviewData }, thunkAPI) => {
   try {
      const res = await writeReview(orderId, reviewData)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || '리뷰 작성 실패')
   }
})

// 팔로잉 취소 (sellerId 받음)
export const unfollowSellerThunk = createAsyncThunk('mypage/unfollowSeller', async (sellerId, thunkAPI) => {
   try {
      const res = await unfollowSeller(sellerId)
      return res.data
   } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || '팔로잉 취소 실패')
   }
})

const mypageSlice = createSlice({
   name: 'mypage',
   initialState: {
      user: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 회원정보 수정
         .addCase(updateMyPageThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateMyPageThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload.user // 서버가 user 객체를 반환한다면
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
            state.user = null // 회원 탈퇴 성공 시 사용자 정보 초기화
         })
         .addCase(deleteAccountThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 리뷰 작성
         .addCase(writeReviewThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(writeReviewThunk.fulfilled, (state) => {
            state.loading = false
            // 리뷰 작성 후 별도 처리 필요 시 여기에 작성
         })
         .addCase(writeReviewThunk.rejected, (state, action) => {
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
            // 팔로잉 취소 성공 시 user.followings 배열에서 해당 판매자 제거
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

export default mypageSlice.reducer
