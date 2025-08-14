export const mockOrderHistory = [
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
   {
      orderId: '20240810-003',
      date: '2024-08-10',
      totalPrice: 65000,
      status: '주문 완료',
      items: [
         { name: '빈티지 은반지', price: 30000, quantity: 1, img: '/images/ring.jpg' },
         { name: '수제 비누 세트', price: 35000, quantity: 1, img: '/images/soap.jpg' },
      ],
   },
]
