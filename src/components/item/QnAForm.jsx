import React, { useState, useRef } from 'react'
import axios from 'axios'
import '../../styles/qna.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const QnAForm = () => {
   const fileInputRef = useRef(null)
   const [images, setImages] = useState([])
   const [formData, setFormData] = useState({
      title: '',
      content: '',
      isSecret: false,
   })

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: type === 'checkbox' ? checked : value,
      }))
   }

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files)
      setImages((prev) => [...prev, ...files])
      e.target.value = ''
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!formData.title.trim() || !formData.content.trim()) {
         alert('제목과 내용을 모두 입력해주세요.')
         return
      }

      try {
         const formPayload = new FormData()
         images.forEach((img) => formPayload.append('images', img))
         formPayload.append('title', formData.title)
         formPayload.append('content', formData.content)
         formPayload.append('isSecret', formData.isSecret)

         const res = await axios.post(`${API_BASE_URL}/api/qna`, formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
         })

         if (res.status === 201) {
            alert('질문이 등록되었습니다.')
            setImages([])
            setFormData({
               title: '',
               content: '',
               isSecret: false,
            })
         }
      } catch (err) {
         console.error(err)
         alert('질문 등록에 실패했습니다.')
      }
   }

   return (
      <div className="qna-page">
         <h2 className="qna-title">질문을 등록해주세요</h2>
         <form className="qna-form" onSubmit={handleSubmit}>
            <div className="image-upload-section">
               <p className="upload-hint">이미지가 있다면 여러 장 첨부하실 수 있습니다.</p>
               <div className="image-preview-list">
                  {images.map((img, idx) => (
                     <div key={idx} className="image-preview-box">
                        <img src={URL.createObjectURL(img)} alt={`preview-${idx}`} />
                     </div>
                  ))}
                  {images.length < 5 && (
                     <div className="image-upload-box" onClick={() => fileInputRef.current.click()}>
                        <span>+</span>
                     </div>
                  )}
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />
               </div>
            </div>
            <div className="input-title-container">
               <label>제목</label>
               <input className="input-title" type="text" name="title" placeholder="제목을 입력하세요" value={formData.title} onChange={handleChange} />
               <label className="private-check">
                  <input type="checkbox" name="isSecret" checked={formData.isSecret} onChange={handleChange} />
                  비밀 글
               </label>
            </div>
            <div className="form-row">
               <label className="input-content-label">상세한 내용을 입력해주세요</label>
               <textarea className="input-content" name="content" placeholder="내용을 입력하세요" value={formData.content} onChange={handleChange} />
            </div>
            <button type="submit" className="submit-btn">
               등록 하기
            </button>
         </form>
      </div>
   )
}

export default QnAForm
