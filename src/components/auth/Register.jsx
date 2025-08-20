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
            <h3>{message}</h3>
            <div className="modal-buttons">
               <button
                  className="btn-small secondary"
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
   const dispatch = useDispatch()
   const navigate = useNavigate()
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
   const [validationErrors, setValidationErrors] = useState({})
   const [modalState, setModalState] = useState({
      show: false,
      message: '',
      onNavigate: null,
   })
   const { loading, error, user: authUser } = useSelector((state) => state.auth)

   const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
   const openDaumPostcode = useDaumPostcodePopup(scriptUrl)
   // eslint-disable-next-line no-unused-vars
   const profileUrl = authUser?.profile_img || '/uploads/profile-images/default.png'

   const closeModal = () => {
      setModalState({ show: false, message: '' })
   }

   //로그인 되어있으면 나가
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

   // 전화번호
   const handlePhoneChange = (e) => {
      const onlyNums = e.target.value.replace(/\D/g, '')
      setForm((prevForm) => ({ ...prevForm, phone_number: onlyNums }))
   }

   // 출생년도
   const handleBirthYearChange = (e) => {
      const selYear = parseInt(e.target.value, 10)
      const calAge = currentYear - selYear
      setForm((prevForm) => ({ ...prevForm, age: calAge.toString() }))
   }

   // 우편번호
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

   const handleRegister = async (e) => {
      e.preventDefault()
      const errors = {}
      const { email, password, confirmPassword, address, phone_number, age } = form
      if (!email || !address || !password || !confirmPassword || !phone_number) {
         errors.general = '모든 필드를 입력해주세요.'
      }
      if (email && !validateEmail(email)) {
         errors.email = '유효한 이메일 주소를 입력해주세요.'
      }
      if (password && !validatePassword(password)) {
         errors.password = '비밀번호는 8자리 이상이고, 영문자와 특수문자를 포함해야 합니다.'
      }
      if (password && confirmPassword && password !== confirmPassword) {
         errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      }
      if (age && parseInt(age, 10) < 14) {
         errors.age = '만 14세 이상만 가입이 가능합니다.'
      }
      if (!phone_number) {
         errors.phone_number = '전화번호를 입력해주세요.'
      }

      setValidationErrors(errors)

      if (Object.keys(errors).length > 0) {
         return //에러뜨면 멈춰!!!
      }

      try {
         await dispatch(registerUserThunk(form)).unwrap()
         setModalState({ show: true, message: '회원가입이 성공적으로 완료되었습니다.', onNavigate: () => navigate('/login') })
      } catch (err) {
         console.error('회원가입 에러:', err)
         setModalState({ show: true, message: `회원가입 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}` })
      }
   }

   if (authUser && modalState.show) {
      return <Modal message={modalState.message} onClose={closeModal} onNavigate={modalState.onNavigate} />
   }

   return (
      <div className="register-container">
         <form onSubmit={handleRegister} className="register-form">
            <h2>회원가입</h2>
            {error && <p className="register-error">{error}</p>}
            {validationErrors.general && <p className="register-error">{validationErrors.general}</p>}

            <div className="register-input">
               <label>이름</label>
               <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력해주세요" />
            </div>
            <div className="register-input">
               <label>이메일</label>
               <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@example.com" />
               {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
            </div>
            <div className="register-input">
               <label>비밀번호</label>
               <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="8자리 이상, 특수문자 포함" />
               {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}
            </div>
            <div className="register-input">
               <label>비밀번호 확인</label>
               <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
               {validationErrors.confirmPassword && <p className="error-message">{validationErrors.confirmPassword}</p>}
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
               {validationErrors.age && <p className="error-message">{validationErrors.age}</p>}
            </div>

            <div className="register-input">
               <label htmlFor="phone">전화번호</label>
               <input type="tel" id="phone" name="phone_number" value={form.phone_number} className="phone-input" placeholder="01012345678" maxLength="11" onChange={handlePhoneChange} />
               {validationErrors.phone_number && <p className="error-message">{validationErrors.phone_number}</p>}
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

            <div className="button-group">
               <button type="submit" disabled={loading}>
                  {loading ? '가입 중...' : '회원가입 완료'}
               </button>
            </div>
         </form>

         {modalState.show && <Modal message={modalState.message} onClose={closeModal} onNavigate={modalState.onNavigate} />}
      </div>
   )
}

export default Register
