import minimartApi from './axiosApi'

// 내 정보 수정
export const updateMyPage = (data) => {
   return minimartApi.patch('/mypage/edit', data)
}
// 회원 탈퇴
export const deleteAccount = () => {
   return minimartApi.delete('/mypage/delete')
}
// 리뷰 작성
export const writeReview = (formData) => {
   return minimartApi.post('/mypage/review', formData)
}
// 팔로잉 취소
export const unfollowSeller = (sellerId) => {
   return minimartApi.delete(`/unfollow/${sellerId}`)
}
// 주문 취소
export const cancelOrder = (orderId) => {
   return minimartApi.patch(`/orders/${orderId}/cancel`, {})
}

// 판매자 내정보 가져오기
export const getSeller = async () => {
   const response = await minimartApi.get('/mypage/seller')
   return response.data
}
