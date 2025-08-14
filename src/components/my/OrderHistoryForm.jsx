import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchOrderHistoryThunk, cancelOrderThunk } from '../../features/mypageSlice'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.mypage)
   const navigate = useNavigate()

   useEffect(() => {
      dispatch(fetchOrderHistoryThunk())
   }, [dispatch])

   const handleWriteReview = (order) => {
      navigate('/review', { state: { order } })
   }

   const handleCancelOrder = async (orderId) => {
      if (window.confirm('주문을 취소하시겠습니까?')) {
         try {
            await dispatch(cancelOrderThunk(orderId)).unwrap()
            alert('주문이 취소되었습니다.')
         } catch (err) {
            alert(`주문 취소 실패: ${err.message || '알 수 없는 오류'}`)
         }
      }
   }

   const renderActionButtons = (order) => {
      const isReviewable = order.status === 'SHIPPED'
      const isCancellable = order.status === 'PAID'
      const isCanceled = order.status === 'CANCELED'

      const reviewButton = order.hasReview ? (
         <button className="btn-small primary" onClick={() => alert(`리뷰 수정 기능 (주문 ID: ${order.orderId})`)} disabled={loading}>
            리뷰 수정
         </button>
      ) : (
         <button className="btn-small primary" onClick={() => handleWriteReview(order)} disabled={loading}>
            리뷰 작성
         </button>
      )

      const cancelButton = (
         <button className="btn-small danger" onClick={() => handleCancelOrder(order.orderId)} disabled={loading}>
            주문 취소
         </button>
      )

      return (
         <div className="actions">
            {isReviewable && reviewButton}
            {isCancellable && cancelButton}
         </div>
      )
   }

   const renderOrderContent = () => {
      if (loading) {
         return <p className="loading">로딩 중...</p>
      }
      if (error) {
         return <p className="error">에러: {error}</p>
      }
      if (orders.length === 0) {
         return <p className="empty-text">구매 내역이 없습니다.</p>
      }

      return (
         <div className="order-list">
            {orders.map((order) => (
               <div className="order-item" key={order.orderId}>
                  <div className="order-info-header">
                     <p>주문 번호: {order.orderId}</p>
                     <p>주문 날짜: {order.date}</p>
                     <p>총 결제 금액: {order.totalPrice}원</p>
                     <p>배송 상태: {order.status}</p>
                  </div>
                  <div className="order-item-details">
                     {order.items.map((item) => (
                        <div key={item.itemId} className="item-card">
                           <img src={item.imageUrl || '/default-product.png'} alt={item.name} />
                           <div className="item-info">
                              <p className="item-name">{item.name}</p>
                              <p className="item-price">
                                 {item.price}원 ({item.quantity}개)
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
                  {renderActionButtons(order)}
               </div>
            ))}
         </div>
      )
   }

   return (
      <section className="order-history-section">
         <h2 className="section-title">구매 내역</h2>
         {renderOrderContent()}
      </section>
   )
}

export default OrderHistoryForm
