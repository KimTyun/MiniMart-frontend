// 가상의 주문 내역 데이터
const mockOrderHistory = [
   {
      orderId: '20240814-001',
      date: '2024-08-14',
      totalPrice: 48000,
      status: '배송 완료',
      items: [
         { name: '핸드메이드 가죽 지갑', price: 25000, quantity: 1, img: '/images/wallet.jpg' },
         { name: '디자이너 머그컵', price: 23000, quantity: 1, img: '/images/mug.jpg' },
      ],
   },
   {
      orderId: '20240812-002',
      date: '2024-08-12',
      totalPrice: 15000,
      status: '배송 중',
      items: [{ name: '심플한 캔버스 에코백', price: 15000, quantity: 1, img: '/images/ecobag.jpg' }],
   },
]

// 가상의 팔로워 데이터
const mockFollowedSellers = [
   { id: 'seller-001', name: '가죽 공방', profileImg: '/images/seller1.jpg' },
   { id: 'seller-002', name: '아름다운 도자기', profileImg: '/images/seller2.jpg' },
   { id: 'seller-003', name: '핸드메이드 주얼리', profileImg: '/images/seller3.jpg' },
]

/**
 * 가상의 주문 내역을 가져오는 비동기 함수
 * @returns {Promise<{ data: Array }>}
 */
export const getOrderHistory = () => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve({ data: mockOrderHistory })
      }, 1000)
   })
}

/**
 * 가상의 팔로우한 판매자 목록을 가져오는 비동기 함수
 * @returns {Promise<{ data: Array }>}
 */
export const getFollowedSellers = () => {
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve({ data: mockFollowedSellers })
      }, 1000)
   })
}
