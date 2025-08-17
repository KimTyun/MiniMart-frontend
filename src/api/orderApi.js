import minimartApi from './axiosApi'

//장바구니 등록
export const addCart = async (item) => {
   try {
      const response = await minimartApi.post('/order/cart', item)
      return response.data
   } catch (error) {
      console.error('장바구니 등록 실패 : ', error)
      throw error
   }
}

// 장바구니 내역 가져오기
export const getCarts = async () => {
   try {
      const response = await minimartApi.get('/order/cart')
      return response.data
   } catch (error) {
      console.error('장바구니 가져오기 실패 : ', error)
      throw error
   }
}

// 장바구니 안의 상품 갯수 변경하기
export const updateCartItem = async (data) => {
   try {
      const response = await minimartApi.put('/order/cart', data)
      return response.data
   } catch (error) {
      console.error('장바구니 변경 실패 : ', error)
      throw error
   }
}

// 장바구니 안의 상품 빼기
export const deleteCartItem = async (id) => {
   try {
      const response = await minimartApi.delete(`/order/cart/${id}`)
      return response.data
   } catch (error) {
      console.error('장바구니 삭제 실패 : ', error)
      throw error
   }
}
