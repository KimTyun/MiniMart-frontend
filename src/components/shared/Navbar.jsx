import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserThunk, fetchUserInfoThunk } from '../../features/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
   width: 6rem;
   height: 32px;
   font-size: 15px;
   border: none;
   border-radius: 6px;
   margin-right: 10px;
   cursor: pointer;
`

const LoginButton = styled.button`
   width: 50px;
   height: 25px;
   font-size: 10px;
   background-color: #2c2c2c;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
`
function Haeder() {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth?.user)
   const token = useSelector((state) => state.auth.token)
   const navigate = useNavigate()

   useEffect(() => {
      if (token && !user) {
         dispatch(fetchUserInfoThunk())
      }
   }, [dispatch, token, user])

   const handleLogout = () => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            navigate('/') // 로그아웃시 홈으로 이동
         })
         .catch((error) => {
            alert('로그아웃 실패: ' + error)
         })
   }

   const goToManager = () => {
      navigate('/manager')
   }

   const goSellerMyPage = () => {
      navigate('/seller/mypage')
   }

   // 이미지 가져오지 못했을때 새로고침시 오류 해결
   const getImage = () => {
      if (!user.profile_img || user.profile_img === '/uploads/profile-images/default.png') {
         return '/none_profile_img.png'
      }
      return user.profile_img
   }

   return (
      <div style={{ width: '100%' }}>
         <div style={{ display: 'flex', height: '89px', justifyContent: 'space-between' }}>
            <div style={{ height: '80px', lineHeight: '120px', textAlign: 'left' }}>
               <Link to="/">
                  <img style={{ width: '150px', marginLeft: '30px' }} src="/Logo.png" alt="미니마트 로고" />
               </Link>
            </div>
            <div style={{ width: '35rem', height: '89px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: '40px' }}>
               <button style={{ fontSize: '14px', border: 'none', borderRadius: '6px', marginRight: '10px', width: '100px', height: '32px', backgroundColor: '#FACC15', color: 'white', cursor: 'pointer' }} onClick={() => navigate('/search?keyword=')}>
                  상품 주문
               </button>
               <Button onClick={() => navigate('/cart')}>장바구니</Button>
               <Button onClick={() => navigate('/customer-service')}>고객센터</Button>
               {user ? (
                  <>
                     {user.role == 'ADMIN' ? <Button onClick={goToManager}>고객 관리</Button> : null}
                     {user.role == 'SELLER' ? <Button onClick={goSellerMyPage}>상점 관리</Button> : null}
                     <img src={getImage()} alt="프로필" style={{ width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/mypage')} referrerPolicy="no-referrer" />
                     <p style={{ width: '9rem' }}>{user.name}</p>
                     <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
                  </>
               ) : (
                  <Link
                     to="/login"
                     style={{
                        display: 'inline-block',
                        width: 'fit-content',
                        textDecoration: 'none',
                     }}
                  >
                     <LoginButton>로그인</LoginButton>
                  </Link>
               )}
            </div>
         </div>
         <div style={{ height: '142px', backgroundColor: '#EBD96B' }}></div>
      </div>
   )
}

export default Haeder
