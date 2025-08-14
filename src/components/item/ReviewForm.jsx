import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReviewThunk, resetReviewState } from '../../features/reviewSlice'
import '../../styles/review.css'

const ReviewForm = ({ orderId, productId, imageUrl, productName, orderDate }) => {
   const dispatch = useDispatch()
   const { loading, success, error } = useSelector((state) => state.review)

   const [content, setContent] = useState('')
   const [rating, setRating] = useState(0)
   const [img, setImg] = useState(null)

   useEffect(() => {
      if (success) {
         alert('리뷰가 성공적으로 등록되었습니다.')
         setContent('')
         setRating(0)
         setImg(null)
         dispatch(resetReviewState())
      }
   }, [success, dispatch])

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!content.trim() || rating === 0) {
         alert('내용과 평점은 필수 입력 사항입니다.')
         return
      }

      const formData = new FormData()
      formData.append('orderId', orderId)
      formData.append('productId', productId)
      formData.append('content', content)
      formData.append('rating', rating)
      if (img) {
         formData.append('image', img)
      }

      dispatch(createReviewThunk(formData))
   }

   const handleImageChange = (e) => {
      const file = e.target.files[0]
      if (file) {
         setImageFile(file)
      }
   }

   return (
      <div className="review-form-container">
         <h3 className="review-form-header">리뷰 작성</h3>
         {error && <p style={{ color: 'red' }}>{error}</p>}

         <div className="product-review-info">
            <img className="product-review-image" src={imageUrl} alt={productName} />
            <div className="product-review-details">
               <p className="product-review-name">{productName}</p>
               <p className="product-review-date">주문일: {orderDate}</p>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="review-form">
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
               <textarea placeholder="상품에 대한 솔직한 리뷰를 작성해주세요." value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>

            <div className="image-upload-section">
               <label htmlFor="review-image">이미지 첨부:</label>
               <input id="review-image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="form-actions">
               <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                     /* 취소 로직 */
                  }}
               >
                  취소
               </button>
               <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '등록 중...' : '리뷰 등록'}
               </button>
            </div>
         </form>
      </div>
   )
}

export default ReviewForm
