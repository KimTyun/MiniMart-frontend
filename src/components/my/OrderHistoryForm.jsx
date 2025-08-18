import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPageThunk, createReviewThunk, cancelOrderThunk } from '../../features/mypageSlice'
import '../../styles/mypage.css'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.mypage)

   // 모달
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedOrderId, setSelectedOrderId] = useState(null)
   const [reviewText, setReviewText] = useState('')

   useEffect(() => {
      dispatch(fetchMyPageThunk())
   }, [dispatch])

   // 주문 취소
   const handleCancelOrder = async (orderId) => {
      if (window.confirm('정말 주문을 취소하시겠습니까?')) {
         try {
            await dispatch(cancelOrderThunk(orderId)).unwrap()
            alert('주문이 취소되었습니다.')
         } catch (err) {
            alert(`주문 취소 실패: ${err.message || '알 수 없는 오류'}`)
         }
      }
   }

   // 리뷰 작성 버튼 클릭 시 모달 열기
   const handleOpenModal = (orderId) => {
      setSelectedOrderId(orderId)
      setIsModalOpen(true)
   }

   // 모달 닫기
   const handleCloseModal = () => {
      setIsModalOpen(false)
      setReviewText('')
      setSelectedOrderId(null)
   }

   // 리뷰 작성
   const handleSubmitReview = async () => {
      if (!reviewText.trim()) {
         // alert() 대신 커스텀 메시지를 표시
         console.error('리뷰 내용을 입력해주세요.')
         return
      }

      try {
         await dispatch(
            createReviewThunk({
               orderId: selectedOrderId,
               reviewData: { content: reviewText },
            })
         ).unwrap()
         console.log('리뷰가 성공적으로 등록되었습니다.')
         handleCloseModal() // 리뷰 제출 후 모달 닫기
      } catch (err) {
         console.error(`리뷰 등록 실패: ${err.message || '알 수 없는 오류'}`)
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
                     <div className="item-details">
                        <div className="thumb">
                           <img src={order.items[0].imageUrl || '/default-product.png'} alt={order.items[0].name} />
                        </div>
                        <div className="info">
                           <p className="title">
                              {order.items[0].name} {order.items.length > 1 ? `외 ${order.items.length - 1}개` : ''}
                           </p>
                           <p className="meta">주문일: {order.date}</p>
                           <p className="meta">상태: {order.status}</p>
                        </div>
                     </div>
                     <div className="seller-mini">
                        <img src={order.seller.avatarUrl || 'https://via.placeholder.com/50'} alt={order.seller.name} className="seller-avatar" />
                        <span>{order.seller.name}</span>
                     </div>
                     <div className="actions">
                        {/* 주문 취소 */}
                        <button className="btn-small secondary" onClick={() => handleCancelOrder(order.orderId)} disabled={loading || order.status !== 'PAID'}>
                           주문 취소
                        </button>
                        {/* 리뷰 */}
                        <button className="btn-small primary" onClick={() => handleOpenModal(order.orderId)} disabled={loading || order.hasReview || order.status !== 'DELIVERED'}>
                           {order.hasReview ? '리뷰 완료' : '리뷰 작성'}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* 리뷰 모달 */}
         {isModalOpen && (
            <div className="modal-overlay">
               <div className="modal-content">
                  <h3>리뷰 작성</h3>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="리뷰 내용을 입력하세요..." />
                  <div className="modal-buttons">
                     <button className="btn-small secondary" onClick={handleCloseModal}>
                        취소
                     </button>
                     <button className="btn-small primary" onClick={handleSubmitReview}>
                        제출
                     </button>
                  </div>
               </div>
            </div>
         )}
      </section>
   )
}

export default OrderHistoryForm
