import React, { useState, useEffect, useCallback } from 'react'
import minimartApi from '../../api/axiosApi'
import '../../styles/managerQnA.css'

const ManagerQnA = () => {
   const [qnaList, setQnaList] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   const [editingId, setEditingId] = useState(null)
   const [replyContent, setReplyContent] = useState('')
   const adminId = useState(1) // 관리자 ID는 로그인 상태에 따라 동적으로 할당 필요

   // Q&A 데이터
   const fetchQnaData = useCallback(async () => {
      try {
         setLoading(true)
         setError(null)
         const response = await minimartApi.get('/admin/qna')
         setQnaList(response.data)
      } catch (err) {
         setError('Q&A 데이터를 불러오는 중 오류가 발생했습니다.')
         console.error('Q&A 데이터 불러오기 실패:', err)
      } finally {
         setLoading(false)
      }
   }, [])

   useEffect(() => {
      fetchQnaData()
   }, [fetchQnaData])

   const handleToggleReplyForm = (qna) => {
      setEditingId(qna.id)
      setReplyContent(qna.a_content || '')
   }

   const handleCancelReply = () => {
      setEditingId(null)
      setReplyContent('')
   }

   const handleReplySubmit = async (e, qnaId) => {
      e.preventDefault()
      if (!replyContent.trim()) {
         alert('답변 내용을 입력해주세요.')
         return
      }

      try {
         await minimartApi.put(`/admin/qna/${qnaId}/answer`, {
            a_content: replyContent,
            adminId: adminId,
         })

         alert('답변이 성공적으로 등록되었습니다.')
         setEditingId(null)
         setReplyContent('')
         fetchQnaData()
      } catch (err) {
         alert('답변 등록 중 오류가 발생했습니다.')
         console.error('답변 등록 실패:', err)
      }
   }

   if (loading) return <div className="loading">로딩 중...</div>
   if (error) return <div className="error">{error}</div>

   return (
      <div className="manager-qna-container">
         <h1>Q&A 관리</h1>
         {qnaList.length === 0 ? (
            <p>등록된 문의가 없습니다.</p>
         ) : (
            qnaList.map((qna) => (
               <div key={qna.id} className="qna-item">
                  <div className="qna-header">
                     <span className={`status ${qna.a_content ? 'answered' : 'pending'}`}>{qna.a_content ? '답변 완료' : '답변 대기'}</span>
                     <strong className="qna-title">{qna.title}</strong>
                     <span className="qna-author">작성자: {qna.Questions ? qna.Questions.name : '알 수 없음'}</span>
                     <span className="qna-date">{new Date(qna.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="qna-content">
                     <p className="question">{qna.q_content}</p>
                     {qna.QnaBoardImgs && qna.QnaBoardImgs.length > 0 && (
                        <div className="qna-images">
                           {qna.QnaBoardImgs.map((img, index) => (
                              <img key={index} src={img.img} alt="QnA 이미지" className="qna-img" />
                           ))}
                        </div>
                     )}
                  </div>

                  {/* 답변 */}
                  {editingId === qna.id ? (
                     <form className="reply-form" onSubmit={(e) => handleReplySubmit(e, qna.id)}>
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="답변을 입력하세요..." required />
                        <div className="form-buttons">
                           <button type="submit">답변 등록</button>
                           <button type="button" onClick={handleCancelReply}>
                              취소
                           </button>
                        </div>
                     </form>
                  ) : (
                     <div className="answer-section">
                        {qna.a_content ? (
                           <>
                              <p className="answer-label">답변:</p>
                              <p className="answer">{qna.a_content}</p>
                              <button onClick={() => handleToggleReplyForm(qna)}>답변 수정</button>
                           </>
                        ) : (
                           <button onClick={() => handleToggleReplyForm(qna)}>답변하기</button>
                        )}
                     </div>
                  )}
               </div>
            ))
         )}
      </div>
   )
}

export default ManagerQnA
