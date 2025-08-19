import minimartApi from './axiosApi'

// 판매자 등록 (구매자 → 판매자 승급)
export const registerSeller = (payload) => minimartApi.post('/api/seller/register', payload)
