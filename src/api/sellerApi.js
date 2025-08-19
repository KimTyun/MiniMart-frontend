import minimartApi from './axiosApi'

// 판매자 등록 (구매자 → 판매자 승급)
export const registerSeller = (payload) => minimartApi.post('/auth/seller/register', payload)

export const updateSeller = async (data) => {
   const response = await minimartApi.put('api/seller/update', data)
   return response.data
}
