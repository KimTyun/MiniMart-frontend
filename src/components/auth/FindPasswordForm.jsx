import minimartApi from '../../api/axiosApi'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/findpassword.css'

const PASSWORD_RULE = /^(?=.*[!@#$%^&*])(?=.*[a-zA-Z0-9]).{8,}$/

const FindPasswordForm = () => {
   const [step, setStep] = useState(1)
   const [formData, setFormData] = useState({
      email: '',
      codeInput: '',
      newPassword: '',
   })
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)
   const [errors, setErrors] = useState({
      email: '',
      codeInput: '',
      newPassword: '',
      confirmPassword: '',
   })

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: '' }))
   }

   const validateForm = (fields) => {
      let isValid = true
      const newErrors = { email: '', codeInput: '', newPassword: '', confirmPassword: '' }

      if (fields.includes('email') && !formData.email) {
         newErrors.email = '이메일을 입력해주세요.'
         isValid = false
      }
      if (fields.includes('codeInput') && !formData.codeInput) {
         newErrors.codeInput = '인증 코드를 입력해주세요.'
         isValid = false
      }
      if (fields.includes('newPassword') && !formData.newPassword) {
         newErrors.newPassword = '새 비밀번호를 입력해주세요.'
         isValid = false
      }
      if (fields.includes('confirmPassword') && formData.newPassword !== formData.confirmPassword) {
         newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
         isValid = false
      }
      if (fields.includes('newPassword') && formData.newPassword && !PASSWORD_RULE.test(formData.newPassword)) {
         newErrors.newPassword = '8자리 이상, 특수문자 1개 이상 포함.'
         isValid = false
      }

      setErrors(newErrors)
      return isValid
   }

   const handleSendCode = async () => {
      if (!formData.email) {
         setMessage('이메일을 입력해주세요.')
         return
      }
      setLoading(true)
      try {
         await minimartApi.post('auth/local/find/email/send-code', { email: formData.email })
         setStep(2)
         setMessage('인증 코드가 이메일로 전송되었습니다.')
      } catch (err) {
         setMessage(err.response?.data?.message || '오류가 발생했습니다.')
      } finally {
         setLoading(false)
      }
   }

   const handleVerifyCode = async () => {
      if (!formData.codeInput) {
         setMessage('인증 코드를 입력해주세요.')
         return
      }
      setLoading(true)
      try {
         setStep(3)
         setMessage('인증 코드가 확인되었습니다. 새 비밀번호를 입력해주세요.')
      } catch (err) {
         setMessage(err.response?.data?.message || '인증 코드가 올바르지 않습니다.')
      } finally {
         setLoading(false)
      }
   }

   const handleResetPassword = async () => {
      if (!validateForm(['newPassword', 'confirmPassword'])) {
         setMessage('입력 내용을 확인해주세요.')
         return
      }
      setLoading(true)
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
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="form-container">
         <h2>비밀번호 찾기</h2>

         {step === 1 && (
            <div className="form-box">
               <label>이메일</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" />
               {errors.email && <p className="error-text">{errors.email}</p>}
               <button onClick={handleSendCode} className="btn" disabled={loading}>
                  {loading ? '전송 중...' : '인증 코드 전송'}
               </button>
            </div>
         )}

         {step === 2 && (
            <div className="form-box">
               <p className="message-text">이메일로 전송된 인증 코드를 입력해주세요.</p>
               <label>인증 코드</label>
               <input type="text" name="codeInput" value={formData.codeInput} onChange={handleChange} className="input" />
               {errors.codeInput && <p className="error-text">{errors.codeInput}</p>}
               <button onClick={handleVerifyCode} className="btn" disabled={loading}>
                  {loading ? '확인 중...' : '인증 코드 확인'}
               </button>
            </div>
         )}

         {step === 3 && (
            <div className="form-box">
               <p className="message-text">새 비밀번호를 설정해주세요.</p>
               <label>새 비밀번호</label>
               <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="input" />
               {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
               <label>비밀번호 확인</label>
               <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input" />
               {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
               <button onClick={handleResetPassword} className="btn" disabled={loading}>
                  {loading ? '변경 중...' : '비밀번호 변경'}
               </button>
            </div>
         )}

         {step === 4 && (
            <div className="form-box">
               <p className="success-message">{message}</p>
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
