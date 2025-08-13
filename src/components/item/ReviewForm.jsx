import React, { useState, useRef } from 'react'
import axios from 'axios'
import '../../styles/review.css'

const ReviewForm = () => {
   const fileInputRef = useRef(null)
   const [images, setImages] = useState([])
   const [title, setTitle] = useState('')
   const [content, setContent] = useState('')
   const [isSecret, setIsSecret] = useState(false)

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files)
      setImages((prev) => [...prev, ...files])
      e.target.value = ''
   }
   const handleImageUploadClick = () => {
      fileInputRef.current.click()
   }
   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!title.trim() || !content.trim()) {
         alert('제목과 내용을 모두 입력해주세요.')
         return
      }

      try {
         const formData = new FormData()
         images.forEach((img) => formData.append('images', img))
         formData.append('title', title)
         formData.append('content', content)
         formData.append('isSecret', isSecret)

         const res = await axios.post('http://localhost:8000/api/reviews', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
         })

         if (res.status === 201) {
            alert('리뷰가 등록되었습니다.')
            setImages([])
            setTitle('')
            setContent('')
            setIsSecret(false)
         }
      } catch (err) {
         console.error(err)
         alert('리뷰 등록에 실패했습니다.')
      }
   }

   return (
      <div className="review-page">
         <h2 className="review-title">질문을 등록해주세요</h2>
         <form className="review-form" onSubmit={handleSubmit}>
            <div className="image-upload-section">
               <p className="upload-hint">이미지가 있다면 여러 장 첨부하실 수 있습니다.</p>
               <div className="image-preview-list">
                  {images.map((img, idx) => (
                     <div key={idx} className="image-preview-box">
                        <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                     </div>
                  ))}
                  {/* ⭐ 이미지가 5장 미만일 때만 빈 박스 표시 */}
                  {images.length < 5 && (
                     <div className="image-upload-box" onClick={handleImageUploadClick}>
                        <span>+</span>
                     </div>
                  )}
                  {/* ⭐ 숨겨진 파일 입력 필드 */}
                  <input
                     type="file"
                     multiple
                     accept="image/*"
                     ref={fileInputRef} // useRef로 참조
                     onChange={handleImageChange}
                     style={{ display: 'none' }}
                  />
               </div>
            </div>
            <div className="input-title-container">
               <label>제목</label>
               <input className="input-title" type="text" placeholder="리뷰 제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
               <label className="private-check">
                  <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} />
                  비밀 글
               </label>
            </div>

            {/* 내용 */}
            <div className="form-row">
               <label className="input-content-label">상세한 내용을 입력해주세요</label>
               <textarea className="input-content" placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            {/* 등록 버튼 */}
            <button type="submit" className="submit-btn">
               등록 하기
            </button>
         </form>
      </div>
   )
}
export default ReviewForm
