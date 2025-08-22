import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMyPageThunk, createReviewThunk, cancelOrderThunk } from '../../features/mypageSlice'
import '../../styles/mypage.css'

const OrderHistoryForm = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user, isAuthenticated, Loading } = useSelector((state) => state.auth)

   const { orders, loading, error } = useSelector((state) => state.mypage)

   // 모달 상태 관리
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [reviewingOrder, setReviewingOrder] = useState(null)
   const [content, setContent] = useState('')
   const [formMessage, setFormMessage] = useState('')

   // 알림 모달 상태 관리
   const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
   const [alertMessage, setAlertMessage] = useState('')
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const [confirmMessage, setConfirmMessage] = useState('')
   const [confirmCallback, setConfirmCallback] = useState(null)

   useEffect(() => {
      if (!Loading && isAuthenticated && user && user.id) {
         dispatch(fetchMyPageThunk())
      } else if (!Loading && (!isAuthenticated || !user)) {
         console.log('인증이 실패했습니다. 사용자 정보를 불러올 수 없습니다.')
      }
   }, [dispatch, user, isAuthenticated, Loading])

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

   // 재구매 버튼
   const handleReorder = (orderId) => {
      console.log(`Order ID: ${orderId}의 상품을 장바구니에 담습니다.`)
      navigate('/cart')
   }

   // 리뷰 작성 버튼 클릭 시 모달 열기
   const handleOpenReviewModal = (order) => {
      if (order.OrderItems && order.OrderItems.length > 0) {
         setReviewingOrder(order)
         setIsModalOpen(true)
         setContent('')
         setFormMessage('')
      } else {
         showAlert('리뷰를 작성할 상품 정보가 없습니다.')
      }
   }

   // 모달 닫기
   const handleCloseModal = () => {
      setIsModalOpen(false)
      setReviewingOrder(null)
      setContent('')
      setFormMessage('')
   }

   if (Loading || loading) {
      return <div className="loading-container">사용자 정보를 불러오는 중입니다...</div>
   } else if (error) {
      return <div className="error-container">에러 발생: {error}</div>
   } else if (!user || !isAuthenticated) {
      return <div className="loading-container">로그인 정보가 유효하지 않습니다.</div>
   }

   // 리뷰 작성
   const handleSubmitReview = async () => {
      if (!user || !user.id) {
         showAlert('사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.')
         return
      }

      const firstItem = reviewingOrder.OrderItems[0]?.Item
      const productId = firstItem?.id
      const sellerId = reviewingOrder.seller?.id

      if (!productId) {
         showAlert('리뷰를 작성할 상품 정보를 찾을 수 없습니다.')
         return
      }
      if (!sellerId) {
         showAlert('판매자 정보를 찾을 수 없습니다.')
         return
      }

      try {
         const reviewData = {
            buyerId: user.id,
            sellerId: sellerId,
            productId: productId,
            orderId: reviewingOrder.orderId,
            content: content,
            rating: 5,
            img: null,
         }

         await dispatch(createReviewThunk(reviewData)).unwrap()

         showAlert('리뷰가 성공적으로 등록되었습니다.')
         handleCloseModal()
      } catch (err) {
         showAlert(`리뷰 등록 실패: ${err.message || '알 수 없는 오류'}`)
      }
   }

   return (
      <section className="order-history-section">
         <h2 className="section-title">구매 내역</h2>
         {orders.length === 0 && <p className="empty-text">구매 내역이 없습니다.</p>}
         {orders.length > 0 && (
            <div className="order-list">
               {orders.map((order) => {
                  if (!order.OrderItems || order.OrderItems.length === 0) {
                     console.log(`주문 ID ${order.orderId}에 대한 상품 정보가 없습니다.`)
                     return null
                  }

                  const firstItem = order.OrderItems[0]?.Item
                  if (!firstItem) return null

                  return (
                     <div className="order-item" key={order.orderId}>
                        <div className="item-details">
                           <div className="thumb">
                              <img src={firstItem.ItemImgs[0]?.url || 'https://placehold.co/100x100'} alt={firstItem.name} className="product-image" />
                           </div>
                           <div className="info">
                              <p className="meta">주문일: {order.date}</p>
                              <h3 className="title">
                                 {firstItem.name} {order.OrderItems.length > 1 ? `외 ${order.OrderItems.length - 1}개` : ''}
                              </h3>
                              <p className="meta">
                                 상태: <span className={`status-text status-${order.status.toLowerCase()}`}>{order.status}</span>
                              </p>
                           </div>
                        </div>
                        <div className="seller-mini">
                           <img src={order.seller?.avatarUrl || 'https://via.placeholder.com/50'} alt={order.seller?.name} className="seller-avatar" />
                           <span>{order.seller?.name}</span>
                        </div>
                        <div className="actions">
                           <button className="btn-small btn-secondary" onClick={() => handleCancelOrder(order.orderId)} disabled={loading || order.status !== 'PAID'}>
                              주문 취소
                           </button>
                           <button className="btn-small btn-primary" onClick={() => handleOpenReviewModal(order)} disabled={loading || order.hasReview || order.status !== 'DELIVERED' || !user || !user.id}>
                              {order.hasReview ? '리뷰 완료' : '리뷰 작성'}
                           </button>
                           {order.status === 'DELIVERED' && (
                              <button className="btn-small primary" onClick={() => handleReorder(order.orderId)} disabled={loading}>
                                 재구매
                              </button>
                           )}
                        </div>
                     </div>
                  )
               })}
            </div>
         )}

         {isModalOpen && reviewingOrder && (
            <div className="modal-overlay">
               <div className="modal-content">
                  <h3 className="modal-title">리뷰 작성</h3>
                  {formMessage && <div className="form-message">{formMessage}</div>}
                  <p className="review-for-item">
                     <span className="item-name">{reviewingOrder.OrderItems[0]?.Item?.name}</span>에 대한 리뷰를 작성합니다.
                  </p>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="상품에 대한 솔직한 리뷰를 남겨주세요." className="review-textarea" rows="4" />
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
