import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addCart, deleteCartItem, getCarts, updateCartItem } from '../api/orderApi'

export const addCartThunk = createAsyncThunk('order/addCart', async (item, { rejectWithValue }) => {
   try {
      const response = await addCart(item)
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '장바구니 등록 실패')
   }
})

export const getCartsThunk = createAsyncThunk('order/getCarts', async (_, { rejectWithValue }) => {
   try {
      const response = await getCarts()
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '장바구니 등록 실패')
   }
})

export const updateCartItemThunk = createAsyncThunk('order/updateCartItem', async (data, { rejectWithValue }) => {
   try {
      const response = await updateCartItem(data)
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '장바구니 등록 실패')
   }
})

export const deleteCartItemThunk = createAsyncThunk('order/deleteCartItem', async (id, { rejectWithValue }) => {
   try {
      const response = await deleteCartItem(id)
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '장바구니 삭제 실패')
   }
})

const orderSlice = createSlice({
   name: 'order',
   initialState: {
      user: null,
      carts: [],
      orders: [],

      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(addCartThunk.pending, (s) => {
            s.loading = true
         })
         .addCase(addCartThunk.fulfilled, (s) => {
            s.loading = false
         })
         .addCase(addCartThunk.rejected, (s, a) => {
            s.error = a.payload
            s.loading = false
         })

         .addCase(getCartsThunk.pending, (s) => {
            s.loading = true
         })
         .addCase(getCartsThunk.fulfilled, (s, a) => {
            s.loading = false
            s.carts = a.payload.cart
         })
         .addCase(getCartsThunk.rejected, (s, a) => {
            s.error = a.payload
            s.loading = false
         })

         .addCase(updateCartItemThunk.pending, (s) => {
            s.loading = true
         })
         .addCase(updateCartItemThunk.fulfilled, (s) => {
            s.loading = false
         })
         .addCase(updateCartItemThunk.rejected, (s, a) => {
            s.error = a.payload
            s.loading = false
         })

         .addCase(deleteCartItemThunk.pending, (s) => {
            s.loading = true
         })
         .addCase(deleteCartItemThunk.fulfilled, (s) => {
            s.loading = false
         })
         .addCase(deleteCartItemThunk.rejected, (s, a) => {
            s.error = a.payload
            s.loading = false
         })
   },
})

export default orderSlice.reducer
