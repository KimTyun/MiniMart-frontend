import minimartApi from './axiosApi'
// const API_URL = import.meta.env.VITE_API_URL

export const itemRecent = async () => {
   try {
      const response = await minimartApi.get('/item/recent')
      return response.data
   } catch (error) {
      console.error('최근 상품 불러오기 실패 : ', error)
      throw error
   }
}

export const itemPopular = async () => {
   try {
      const response = await minimartApi.get('/item/popular/age')
      return response.data
   } catch (error) {
      console.error('인기 상품 불러오기 실패 : ', error)
      throw error
   }
}

export const searchItems = async (params) => {
   try {
      const response = await minimartApi.get('/api/item/search', { params })
      return response.data.data
   } catch (error) {
      throw error.response?.data || error
   }
}
