import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createReviewThunk, resetReviewState } from '../../features/reviewSlice'

const ReviewForm = ({ buyerId, sellerId }) => {
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
      formData.append('buyer_id', buyerId)
      formData.append('seller_id', sellerId)
      formData.append('content', content)
      formData.append('rating', rating)
      if (img) formData.append('img', img)

      dispatch(createReviewThunk(formData))
   }

   return (
      <div>
         <h3>리뷰 작성</h3>
         {error && <p style={{ color: 'red' }}>{error}</p>}

         <form onSubmit={handleSubmit}>
            <textarea placeholder="리뷰 내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} required />
            <input type="number" placeholder="평점 (0~5)" value={rating} min="0" max="5" step="0.5" onChange={(e) => setRating(e.target.value)} required />
            <input type="file" accept="image/*" onChange={(e) => setImg(e.target.files[0])} />

            <button type="submit" disabled={loading}>
               {loading ? '등록 중...' : '리뷰 등록'}
            </button>
         </form>
      </div>
   )
}

export default ReviewForm
