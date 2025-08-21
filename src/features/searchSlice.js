import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { searchItems } from '../api/searchApi'

export const searchItemsThunk = createAsyncThunk('search/searchItems', async (params, { rejectWithValue }) => {
   try {
      const data = await searchItems(params)
      return data
   } catch (error) {
      return rejectWithValue(error.message || '상품 검색에 실패했습니다.')
   }
})

const searchSlice = createSlice({
   name: 'search',
   initialState: {
      results: {
         items: [],
         totalItems: 0,
      },
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(searchItemsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(searchItemsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.results = action.payload
         })
         .addCase(searchItemsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default searchSlice.reducer
