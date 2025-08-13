import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createReview } from '../api/reviewApi'

// 리뷰 작성 Thunk
export const createReviewThunk = createAsyncThunk('review/createReview', async (formData, { rejectWithValue }) => {
   try {
      const res = await createReview(formData)
      return res
   } catch (err) {
      return rejectWithValue(err.response?.data || { message: '리뷰 작성 실패' })
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
         state.loading = false
         state.error = null
         state.success = false
      },
   },
   extraReducers: (builder) => {
      builder
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
            state.error = action.payload?.message || '리뷰 작성 실패'
         })
   },
})

export const { resetReviewState } = reviewSlice.actions
export default reviewSlice.reducer
