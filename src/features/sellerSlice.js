// features/sellerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { registerSeller, getSeller } from '../api/sellerApi'

export const registerSellerThunk = createAsyncThunk('seller/register', async (payload, { rejectWithValue }) => {
   try {
      const { data } = await registerSeller(payload)
      return data.seller
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '판매자 등록 실패')
   }
})

export const getSellerThunk = createAsyncThunk('seller/getSeller', async (_, { rejectWithValue }) => {
   try {
      const response = await getSeller()
      return response.data.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '판매자 조회 실패')
   }
})

const sellerSlice = createSlice({
   name: 'seller',
   initialState: {
      loading: false,
      error: null,
      sellers: [],
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(registerSellerThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerSellerThunk.fulfilled, (state, action) => {
            state.loading = false
            state.sellers = action.payload
         })
         .addCase(registerSellerThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(getSellerThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getSellerThunk.fulfilled, (state, action) => {
            state.loading = false
            state.sellers = action.payload
         })
         .addCase(getSellerThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default sellerSlice.reducer
