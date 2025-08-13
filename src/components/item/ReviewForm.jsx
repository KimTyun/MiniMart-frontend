// src/components/ReviewForm.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReviewForm.css' // ⭐⭐ 새로운 CSS 파일 import

const ReviewForm = ({ order }) => {
   const [rating, setRating] = useState(0)
   const [reviewText, setReviewText] = useState('')
   const navigate = useNavigate()

   const handleSubmitReview = (e) => {
      e.preventDefault()
      if (rating === 0 || reviewText.trim() === '') {
         alert('별점과 리뷰 내용을 모두 입력해주세요.')
         return
      }

      // ⭐⭐ 실제 API 연동 로직은 여기에 추가
      console.log(`주문 ID: ${order.orderId}, 상품: ${order.items[0].name}, 별점: ${rating}, 리뷰 내용: ${reviewText}`)
      alert('리뷰가 성공적으로 제출되었습니다.')
      navigate('/mypage') // 마이페이지로 돌아가기
   }

   return (
      <div className="review-form-container">
         <h2 className="review-form-header">리뷰 작성</h2>

         <div className="product-review-info">
            <img src={order.items[0].imageUrl} alt={order.items[0].name} className="product-review-image" />
            <div className="product-review-details">
               <p className="product-review-name">{order.items[0].name}</p>
               <p className="product-review-date">구매일: {order.date}</p>
            </div>
         </div>

         <form onSubmit={handleSubmitReview} className="review-form">
            <div className="rating-section">
               <label>별점:</label>
               <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <span key={star} className={star <= rating ? 'star active' : 'star'} onClick={() => setRating(star)}>
                        ★
                     </span>
                  ))}
               </div>
            </div>

            <div className="review-text-section">
               <label>리뷰 내용:</label>
               <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="상품에 대한 솔직한 리뷰를 작성해주세요." />
            </div>

            <div className="form-actions">
               <button type="button" className="btn-cancel" onClick={() => navigate('/mypage')}>
                  취소
               </button>
               <button type="submit" className="btn-submit">
                  리뷰 등록
               </button>
            </div>
         </form>
      </div>
   )
}

export default ReviewForm
