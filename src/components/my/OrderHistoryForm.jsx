import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReviewThunk } from '../../features/mypageSlice'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.mypage)

   // 리뷰 작성
   const handleWriteReview = (orderId) => {
      const reviewContent = window.prompt('리뷰 내용을 입력하세요:') // 모달로 대체하면 더 좋음
      if (reviewContent) {
         dispatch(createReviewThunk({ orderId, reviewData: { content: reviewContent } }))
            .unwrap()
            .then(() => {
               alert('리뷰가 등록되었습니다.')
            })
            .catch((err) => {
               alert(`리뷰 등록 실패: ${err}`)
            })
      }
   }

   return (
      <section className="order-history-section">
         <h2 className="section-title">구매 내역</h2>

         {loading && <p className="loading">로딩 중...</p>}
         {error && <p className="error">에러: {error}</p>}
         {!loading && orders.length === 0 && <p className="empty-text">구매 내역이 없습니다.</p>}

         {!loading && orders.length > 0 && (
            <div className="order-list">
               {orders.map((order) => (
                  <div className="order-item" key={order.orderId}>
                     {' '}
                     {order.items.map((item) => (
                        <div key={item.itemId} className="item-details">
                           <div className="thumb">
                              <img src={item.imageUrl || '/default-product.png'} alt={item.name} />
                           </div>
                           <div className="info">
                              <p className="title">{item.name}</p>
                              <p className="meta">{order.date}</p>
                              <p className="meta">{order.status}</p>
                           </div>
                           <div className="actions">
                              <button className="btn-small primary" onClick={() => handleWriteReview(order.orderId)} disabled={loading}>
                                 리뷰 작성
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               ))}
            </div>
         )}
      </section>
   )
}

export default OrderHistoryForm
