import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { writeReview } from '../api/reviewApi'

export const createReviewThunk = createAsyncThunk('review/createReview', async (reviewData, thunkAPI) => {
   try {
      const response = await writeReview(reviewData)
      return response
   } catch (err) {
      return thunkAPI.rejectWithValue(err.message || '리뷰 작성 실패')
   }
})

const reviewSlice = createSlice({
   name: 'review',
   initialState: {
      loading: false,
      error: null,
      success: false,
   },
   reducers: {
      resetReviewState: (state) => {
         state.success = false
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(createReviewThunk.pending, (state) => {
            state.loading = true
            state.error = null
            state.success = false // 새로운 요청 시 success 상태 초기화
         })
         .addCase(createReviewThunk.fulfilled, (state) => {
            state.loading = false
            state.success = true // 성공 시 success 상태를 true로 설정
         })
         .addCase(createReviewThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.success = false
         })
   },
})

export const { resetReviewState } = reviewSlice.actions
export default reviewSlice.reducer
