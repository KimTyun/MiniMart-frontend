import React, { useState } from 'react'
import minimartApi from '../../api/axiosApi'
import { Link } from 'react-router-dom'
import '../../styles/findpassword.css'

const FindPasswordForm = () => {
   const [step, setStep] = useState(1)
   const [formData, setFormData] = useState({
      email: '',
      codeInput: '',
      newPassword: '',
   })
   const [message, setMessage] = useState('')

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const handleSendCode = async () => {
      try {
         await minimartApi.post('auth/local/find/email/send-code', { email: formData.email })
         setStep(2)
         setMessage('인증 코드가 이메일로 전송되었습니다.')
      } catch (err) {
         setMessage(err.response?.data?.message || '오류가 발생했습니다.')
      }
   }

   const handleVerifyCode = async () => {
      const passwordRule = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/
      if (!passwordRule.test(formData.newPassword)) {
         setMessage('비밀번호는 8자리 이상이어야 하며, 특수문자를 1개 이상 포함해야 합니다.')
         return
      }

      try {
         await minimartApi.post('auth/local/find/email/verify-and-reset', {
            email: formData.email,
            verificationCode: formData.codeInput,
            newPassword: formData.newPassword,
         })
         setStep(4)
         setMessage('비밀번호가 성공적으로 변경되었습니다.')
      } catch (err) {
         setMessage(err.response?.data?.message || '오류가 발생했습니다.')
      }
   }

   return (
      <div className="form-container">
         <h2>비밀번호 찾기</h2>

         {step === 1 && (
            <div className="form-box">
               <label>이메일</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
               <button onClick={handleSendCode} className="btn">
                  인증 코드 전송
               </button>
            </div>
         )}

         {step === 2 && (
            <div className="form-box">
               <label>인증 코드</label>
               <input type="text" name="codeInput" value={formData.codeInput} onChange={handleChange} className="input" />
               <label>새 비밀번호</label>
               <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="input" />
               <button onClick={handleVerifyCode} className="btn">
                  비밀번호 변경
               </button>
            </div>
         )}

         {step === 4 && (
            <div className="form-box">
               <p>{message}</p>
               <Link to="/" className="btn">
                  홈으로 돌아가기
               </Link>
            </div>
         )}

         {message && step !== 4 && <p className="message-text">{message}</p>}
      </div>
   )
}

export default FindPasswordForm
