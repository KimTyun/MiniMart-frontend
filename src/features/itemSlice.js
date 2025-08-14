import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { itemCreate, itemPopular } from '../api/itemApi'
import { itemRecent } from '../api/itemApi'

// 최근 상품 가져오기
export const itemRecentThunk = createAsyncThunk('item/itemRecent', async (_, { rejectWithValue }) => {
   try {
      const data = await itemRecent()
      return data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '최근 상품 가져오기 실패')
   }
})

// 인기 상품 가져오기
export const itemPopularThunk = createAsyncThunk('item/itemPopular', async (_, { rejectWithValue }) => {
   try {
      const data = await itemPopular()
      return data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '인기 상품 가져오기 실패')
   }
})

//상품 등록
export const itemCreateThunk = createAsyncThunk('item/itemCreate', async (data, { rejectWithValue }) => {
   try {
      const response = await itemCreate(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const itemSlice = createSlice({
   name: 'item',
   initialState: {
      loading: false,
      error: null,
      itemRecent: { items: [] },
      itemPopular: { items: [] },
      item: null,
      items: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(itemCreateThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(itemCreateThunk.fulfilled, (state, action) => {
            state.loading = false
            state.item = action.payload.item
         })
         .addCase(itemCreateThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //   최근 등록된 상품
         .addCase(itemRecentThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(itemRecentThunk.fulfilled, (state, action) => {
            state.loading = false
            state.itemRecent = action.payload
         })
         .addCase(itemRecentThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //   인기 등록된 상품
         .addCase(itemPopularThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(itemPopularThunk.fulfilled, (state, action) => {
            state.loading = false
            state.itemPopular = action.payload
         })
         .addCase(itemPopularThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { setToken, logout } = itemSlice.actions
export default itemSlice.reducer
