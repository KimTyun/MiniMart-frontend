import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { recommendCartCountUser } from '../api/pythonApi'

const initialState = {
   recommend: [],
   loading: false,
   error: null,
}

export const fetchRecommend = createAsyncThunk('recommend/fetchRecommend', async (userId, { rejectWithValue }) => {
   try {
      const response = await recommendCartCountUser(userId)
      return response.data
   } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.'
      return rejectWithValue(errorMessage)
   }
})

const recommendSlice = createSlice({
   name: 'recommend',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchRecommend.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchRecommend.fulfilled, (state, action) => {
            state.loading = false
            state.recommend = action.payload
         })
         .addCase(fetchRecommend.rejected, (state, action) => {
            state.loading = false
            state.recommend = []
            state.error = action.payload || '알 수 없는 오류가 발생했습니다.'
         })
   },
})

export default recommendSlice.reducer
