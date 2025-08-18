import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUserThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'
import '../../styles/register.css'
import { useDaumPostcodePopup } from 'react-daum-postcode'

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)

const currentYear = new Date().getFullYear()

const Modal = ({ message, onClose, onNavigate }) => {
   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <p>{message}</p>
            <div className="modal-actions">
               <button
                  className="modal-close-btn"
                  onClick={() => {
                     onClose()
                     if (onNavigate) {
                        onNavigate()
                     }
                  }}
               >
                  확인
               </button>
            </div>
         </div>
      </div>
   )
}

function Register() {
   const [form, setForm] = useState({
      name: '',
      email: '',
      age: '0',
      password: '',
      confirmPassword: '',
      zipcode: '',
      address: '',
      phone_number: '',
      detailaddress: '',
      extraaddress: '',
   })
   const [isRegisterComplete, setIsRegisterComplete] = useState(false)

   const [modalState, setModalState] = useState({
      show: false,
      message: '',
      onNavigate: null,
   })

   const closeModal = () => {
      setModalState({ show: false, message: '' })
   }

   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { loading, error, user: authUser } = useSelector((state) => state.auth)

   // eslint-disable-next-line no-unused-vars
   const profileUrl = authUser?.profile_img || '/uploads/profile-images/default.png'

   const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
   const openDaumPostcode = useDaumPostcodePopup(scriptUrl)

   useEffect(() => {
      if (authUser) {
         setModalState({
            show: true,
            message: '이미 로그인되어 있습니다. 내 정보 페이지로 이동합니다.',
            onNavigate: () => navigate('/mypage'),
         })
      }
   }, [authUser, navigate])

   const handleChange = (e) => {
      const { name, value } = e.target
      setForm((prevForm) => ({ ...prevForm, [name]: value }))
   }

   const handlePhoneChange = (e) => {
      const onlyNums = e.target.value.replace(/\D/g, '')
      setForm((prevForm) => ({ ...prevForm, phone_number: onlyNums }))
   }

   const handleBirthYearChange = (e) => {
      const selYear = parseInt(e.target.value, 10)
      const calAge = currentYear - selYear
      setForm((prevForm) => ({ ...prevForm, age: calAge.toString() }))
   }

   const handleAddressSearch = () => {
      openDaumPostcode({
         onComplete: (data) => {
            let { roadAddress, zonecode, bname, buildingName, apartment } = data
            let extraAddr = ''
            if (bname && /[동|로|가]$/g.test(bname)) extraAddr += bname
            if (buildingName && apartment === 'Y') extraAddr += extraAddr ? `, ${buildingName}` : buildingName
            if (extraAddr) extraAddr = `(${extraAddr})`

            setForm((prevForm) => ({
               ...prevForm,
               zipcode: zonecode,
               address: roadAddress,
               extraaddress: extraAddr,
               detailaddress: '',
            }))
         },
      })
   }

   const handleRegister = () => {
      const { email, password, confirmPassword, address, phone_number, age } = form
      const validations = [
         { condition: !email || !address || !password || !confirmPassword || !phone_number, message: '모든 필드를 입력해주세요.' },
         { condition: !validateEmail(email), message: '유효한 이메일 주소를 입력해주세요.' },
         { condition: !validatePassword(password), message: '비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다.' },
         { condition: password !== confirmPassword, message: '비밀번호가 일치하지 않습니다.' },
         { condition: parseInt(age, 10) < 14, message: '만 14세 이상만 가입이 가능합니다.' },
      ]

      for (const validation of validations) {
         if (validation.condition) {
            setModalState({ show: true, message: validation.message })
            return
         }
      }

      dispatch(registerUserThunk(form))
         .unwrap()
         .then(() => setIsRegisterComplete(true))
         .catch((err) => {
            console.error('회원가입 에러:', err)
            setModalState({ show: true, message: `회원가입 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}` })
         })
   }

   if (isRegisterComplete) {
      return (
         <div className="register-complete-box">
            <h2>회원가입이 완료되었습니다!</h2>
            <p>로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.</p>
            <button onClick={() => navigate('/login')} className="register-complete-button">
               로그인 하러 가기
            </button>
         </div>
      )
   }

   if (authUser && modalState.show) {
      return <Modal message={modalState.message} onClose={closeModal} onNavigate={modalState.onNavigate} />
   }

   return (
      <div className="register-container">
         <h2>회원가입</h2>
         {error && <p className="register-error">{error}</p>}

         <div className="register-input">
            <label>이름</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력해주세요" />
         </div>

         <div className="register-input">
            <label>이메일</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@example.com" />
         </div>

         <div className="register-input">
            <label>비밀번호</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="8자리 이상, 특수문자 포함" />
         </div>

         <div className="register-input">
            <label>비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
         </div>

         <div className="register-input">
            <label htmlFor="birthYear">출생년도</label>
            <select id="birthYear" name="birthYear" className="birthyear-select" value={currentYear - parseInt(form.age, 10)} onChange={handleBirthYearChange}>
               {Array.from({ length: currentYear - 1899 + 1 }, (_, i) => {
                  const year = currentYear - i
                  return (
                     <option key={year} value={year}>
                        {year}
                     </option>
                  )
               })}
            </select>
         </div>

         <div className="register-input">
            <label htmlFor="phone">전화번호</label>
            <input type="tel" id="phone" name="phone_number" value={form.phone_number} className="phone-input" placeholder="01012345678" maxLength="11" onChange={handlePhoneChange} />
         </div>

         <div className="register-input">
            <label>주소지 입력</label>
            <div className="postcode-box">
               <input type="text" className="postcode-box" name="zipcode" value={form.zipcode} readOnly placeholder="우편번호" />
               <button className="postcode-button" type="button" onClick={handleAddressSearch}>
                  우편번호 찾기
               </button>
            </div>
         </div>

         <div className="register-input">
            <input type="text" name="address" value={form.address} readOnly placeholder="주소" />
         </div>

         <div className="address-detail-row">
            <div className="half-input">
               <label>상세주소</label>
               <input type="text" name="detailaddress" value={form.detailaddress} onChange={handleChange} placeholder="상세주소" />
            </div>
            <div className="half-input">
               <label>참고항목</label>
               <input type="text" name="extraaddress" value={form.extraaddress} readOnly placeholder="참고항목" />
            </div>
         </div>

         {modalState.show && <Modal message={modalState.message} onClose={closeModal} />}

         <div className="register-sns">
            <p className="sns-label">다른 방법으로 회원가입하기</p>
            <div className="sns-icons">
               <img src="/kakao_login_small.png" alt="카카오 로그인" />
               <img src="/public/google-icon.png" alt="구글 로그인" />
            </div>
         </div>

         <div className="button-group">
            <button onClick={handleRegister} disabled={loading}>
               {loading ? '가입 중...' : '회원가입 완료'}
            </button>
         </div>
      </div>
   )
}

export default Register
