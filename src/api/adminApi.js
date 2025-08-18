import minimartApi from './axiosApi'

// 승인 대기 목록
export const getPendingSellers = () => minimartApi.get('/admin/sellers/pending')

// 승인
export const approveSeller = (id) => minimartApi.post(`/admin/sellers/approve/${id}`)

// 거절
export const rejectSeller = (id) => minimartApi.post(`/admin/sellers/reject/${id}`)

// 나이별 데이터 가져오기
export const getYear = () => minimartApi.get('/admin/user/year')

// 주문 목록 가져오기
export const getAllOrders = () => minimartApi.get('/admin/orders')

export const deleteOrder = (id) => minimartApi.post(`/admin/orders/delete/${id}`)
