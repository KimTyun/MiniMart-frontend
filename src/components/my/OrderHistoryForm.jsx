import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPageThunk, createReviewThunk, cancelOrderThunk } from '../../features/mypageSlice'
import '../../styles/mypage.css'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.mypage)

   // 모달 상태 관리
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [reviewingOrder, setReviewingOrder] = useState(null)
   const [rating, setRating] = useState(0)
   const [content, setContent] = useState('')
   const [reviewImg, setReviewImg] = useState(null)
   const [formMessage, setFormMessage] = useState('')

   // 알림 모달 상태 관리
   const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
   const [alertMessage, setAlertMessage] = useState('')
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const [confirmMessage, setConfirmMessage] = useState('')
   const [confirmCallback, setConfirmCallback] = useState(null)

   useEffect(() => {
      dispatch(fetchMyPageThunk())
   }, [dispatch])

   // 커스텀 알림 모달 열기
   const showAlert = (message) => {
      setAlertMessage(message)
      setIsAlertModalOpen(true)
   }

   // 커스텀 확인 모달 열기
   const showConfirm = (message, callback) => {
      setConfirmMessage(message)
      setConfirmCallback(() => callback)
      setIsConfirmModalOpen(true)
   }

   // 주문 취소
   const handleCancelOrder = (orderId) => {
      showConfirm('정말 주문을 취소하시겠습니까?', async () => {
         try {
            await dispatch(cancelOrderThunk(orderId)).unwrap()
            showAlert('주문이 취소되었습니다.')
         } catch (err) {
            showAlert(`주문 취소 실패: ${err.message || '알 수 없는 오류'}`)
         }
      })
   }

   // 리뷰 작성 버튼 클릭 시 모달 열기
   const handleOpenReviewModal = (order) => {
      setReviewingOrder(order)
      setIsModalOpen(true)
      // 모달이 열릴 때 상태 초기화
      setRating(0)
      setContent('')
      setReviewImg(null)
      setFormMessage('')
   }

   // 모달 닫기
   const handleCloseModal = () => {
      setIsModalOpen(false)
      setReviewingOrder(null)
      setRating(0)
      setContent('')
      setReviewImg(null)
      setFormMessage('')
   }

   // 별점 클릭 핸들러
   const handleRatingClick = (newRating) => {
      setRating(newRating)
   }

   // 리뷰 작성
   const handleSubmitReview = async () => {
      if (rating === 0) {
         setFormMessage('별점을 선택해주세요.')
         return
      }
      if (!content.trim()) {
         setFormMessage('리뷰 내용을 입력해주세요.')
         return
      }

      setFormMessage('리뷰를 등록 중입니다...')

      try {
         const reviewData = {
            rating,
            content,
            image: reviewImg, // 이미지는 필요에 따라 처리
         }
         await dispatch(
            createReviewThunk({
               orderId: reviewingOrder.orderId,
               reviewData,
            })
         ).unwrap()
         showAlert('리뷰가 성공적으로 등록되었습니다.')
         handleCloseModal()
      } catch (err) {
         showAlert(`리뷰 등록 실패: ${err.message || '알 수 없는 오류'}`)
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
                           <img src={order.items[0].imageUrl || 'https://placehold.co/100x100'} alt={order.items[0].name} className="product-image" />
                        </div>
                        <div className="info">
                           <p className="meta">주문일: {order.date}</p>
                           <h3 className="item-title">
                              {order.items[0].name} {order.items.length > 1 ? `외 ${order.items.length - 1}개` : ''}
                           </h3>
                           <p className="meta">
                              상태: <span className={`status-text status-${order.status.toLowerCase()}`}>{order.status}</span>
                           </p>
                        </div>
                     </div>
                     <div className="seller-mini">
                        <img src={order.seller.avatarUrl || 'https://via.placeholder.com/50'} alt={order.seller.name} className="seller-avatar" />
                        <span>{order.seller.name}</span>
                     </div>
                     <div className="actions">
                        {/* 주문 취소 */}
                        <button className="btn-small btn-secondary" onClick={() => handleCancelOrder(order.orderId)} disabled={loading || order.status !== 'PAID'}>
                           주문 취소
                        </button>
                        {/* 리뷰 */}
                        <button className="btn-small btn-primary" onClick={() => handleOpenReviewModal(order)} disabled={loading || order.hasReview || order.status !== 'DELIVERED'}>
                           {order.hasReview ? '리뷰 완료' : '리뷰 작성'}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* 리뷰 모달 */}
         {isModalOpen && reviewingOrder && (
            <div className="modal-overlay">
               <div className="modal-content">
                  <h3 className="modal-title">리뷰 작성</h3>
                  <button onClick={handleCloseModal} className="modal-close-btn">
                     &times;
                  </button>

                  {formMessage && <div className="form-message">{formMessage}</div>}

                  <p className="review-for-item">
                     <span className="item-name">{reviewingOrder.items[0].name}</span>에 대한 리뷰를 작성합니다.
                  </p>
                  <div className="star-rating">
                     {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`star ${rating >= star ? 'filled' : ''}`} onClick={() => handleRatingClick(star)}>
                           ★
                        </span>
                     ))}
                  </div>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="상품에 대한 솔직한 리뷰를 남겨주세요." className="review-textarea" rows="4" />
                  <div className="file-upload-container">
                     <label htmlFor="review-img-upload" className="file-upload-label">
                        이미지 업로드 (선택)
                     </label>
                     <input id="review-img-upload" type="file" accept="image/*" onChange={(e) => setReviewImg(e.target.files[0])} className="file-input" />
                  </div>
                  <div className="modal-buttons">
                     <button className="btn btn-secondary" onClick={handleCloseModal}>
                        취소
                     </button>
                     <button className="btn btn-primary" onClick={handleSubmitReview}>
                        제출
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* 커스텀 알림 모달 */}
         {isAlertModalOpen && (
            <div className="modal-overlay">
               <div className="modal-content small-modal">
                  <p className="modal-message">{alertMessage}</p>
                  <div className="modal-buttons">
                     <button className="btn btn-primary" onClick={() => setIsAlertModalOpen(false)}>
                        확인
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* 커스텀 확인 모달 */}
         {isConfirmModalOpen && (
            <div className="modal-overlay">
               <div className="modal-content small-modal">
                  <p className="modal-message">{confirmMessage}</p>
                  <div className="modal-buttons">
                     <button className="btn btn-secondary" onClick={() => setIsConfirmModalOpen(false)}>
                        취소
                     </button>
                     <button
                        className="btn btn-primary"
                        onClick={() => {
                           setIsConfirmModalOpen(false)
                           if (confirmCallback) {
                              confirmCallback()
                           }
                        }}
                     >
                        확인
                     </button>
                  </div>
               </div>
            </div>
         )}
      </section>
   )
}

export default OrderHistoryForm
