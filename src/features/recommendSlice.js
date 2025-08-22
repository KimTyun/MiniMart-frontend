import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { recommendCartCountUser } from '../api/pythonApi'

const initialState = {
   recommendations: [],
   loading: false,
   error: null,
}
