import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUserThunk, getKakaoLoginUrlThunk } from '../../features/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import '../../styles/register.css'

const Modal = ({ message, onClose }) => (
   <div className="modal-overlay">
      <div className="modal-content">
         <p>{message}</p>
         <div className="modal-actions">
            <button className="modal-close-btn" onClick={onClose}>
               확인
            </button>
         </div>
      </div>
   </div>
)

function Login() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { loading, error, loginUrl } = useSelector((state) => state.auth)
   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

   const [formData, setFormData] = useState({
      email: '',
      password: '',
   })

   const [showModal, setShowModal] = useState(false)

   useEffect(() => {
      if (isAuthenticated) {
         setShowModal(true)
      }
      dispatch(getKakaoLoginUrlThunk())
   }, [isAuthenticated, dispatch])

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()

      const { email, password } = formData

      if (!email || !password) {
         setShowModal(true)
         return
      }

      const resultAction = await dispatch(loginUserThunk({ email, password }))

      if (loginUserThunk.fulfilled.match(resultAction)) {
         navigate('/')
      } else {
         setShowModal(true)
      }
   }

   const handleModalClose = () => {
      setShowModal(false)
      if (isAuthenticated) {
         navigate('/mypage')
      }
   }

   useEffect(() => {
      dispatch(getKakaoLoginUrlThunk())
   }, [dispatch])

   return (
      <div className="login-container">
         {showModal && <Modal message={isAuthenticated ? '이미 로그인 되어있습니다. 내 정보 페이지로 이동합니다.' : error || '이메일과 비밀번호를 모두 입력해주세요.'} onClose={handleModalClose} />}
         <form className="login-form-box" onSubmit={handleSubmit}>
            <h2 className="login-title">로그인</h2>

            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일" className="login-input" />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호" className="login-input" />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
               {loading ? '로그인 중...' : '로그인'}
            </button>

            <Link to="/register" className="firstvisit">
               처음 방문하셨나요?
            </Link>

            <div className="login-divider">다른 방법으로 로그인하기</div>

            <div className="social-login-icons">
               {loginUrl && (
                  <a style={{ width: '60px' }} href={loginUrl}>
                     <img src="/kakao_login_small.png" alt="카카오 로그인" />
                  </a>
               )}
               <img
                  src={`/public/google-icon.png`}
                  alt="구글 로그인"
                  className="social-icon"
                  onClick={() => {
                     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`
                  }}
               />
            </div>

            <Link to="/findpassword" className="findpassword">
               비밀번호를 잊어버리셨나요?
            </Link>
         </form>
      </div>
   )
}

export default Login
