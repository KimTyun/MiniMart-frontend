import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUserThunk, fetchUserInfoThunk } from '../../features/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// --- Styled Components ---

const NavContainer = styled.nav`
   width: 100%;
   background-color: white;
   font-family: sans-serif;
   border-bottom: 1px solid #f0f0f0;
`

// ✅ padding을 제거하여 전체 너비를 사용하도록 합니다.
const NavLayout = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   height: 80px;
   /* padding: 0 2rem; */ /* 이 줄을 제거합니다. */
`

// ✅ 로고를 감싸는 div를 추가하고 왼쪽에 padding을 줍니다.
const LogoContainer = styled.div`
   padding-left: 2rem;
`

// ✅ 오른쪽 메뉴를 감싸는 div에 오른쪽에 padding을 줍니다.
const RightMenu = styled.div`
   display: flex;
   align-items: center;
   gap: 1.5rem;
   padding-right: 2rem;
`

const TopLink = styled(Link)`
   font-size: 0.8rem;
   color: #555;
   text-decoration: none;
   &:hover {
      color: black;
   }
`

const LoginButton = styled.button`
   font-size: 0.8rem;
   background-color: #333;
   color: white;
   border: none;
   border-radius: 4px;
   padding: 0.4rem 0.8rem;
   cursor: pointer;
`

const UserInfo = styled.div`
   display: flex;
   align-items: center;
   gap: 0.8rem;
   font-size: 0.8rem;
   font-weight: bold;
`

// --- Navbar 컴포넌트 ---

function Navbar() {
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
         .then(() => navigate('/'))
   }

   return (
      <NavContainer>
         <NavLayout>
            {/* ✅ 로고를 LogoContainer로 감싸줍니다. */}
            <LogoContainer>
               <Link to="/">
                  <img src="/Logo.png" alt="미니마트 로고" style={{ width: '200px', display: 'block' }} />
               </Link>
            </LogoContainer>

            <RightMenu>
               <TopLink to="/orders">상품 주문</TopLink>
               <TopLink to="/cart">장바구니</TopLink>
               <TopLink to="/chat">채팅</TopLink>
               <TopLink to="/customer-service">고객센터</TopLink>
               {user ? (
                  <UserInfo>
                     <img src={user.profile_img || '/none_profile_img.webp'} alt="프로필" style={{ width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => navigate('/mypage')} />
                     <span>{user.name}</span>
                     <LoginButton onClick={handleLogout}>로그아웃</LoginButton>
                  </UserInfo>
               ) : (
                  <Link to="/login">
                     <LoginButton>로그인</LoginButton>
                  </Link>
               )}
            </RightMenu>
         </NavLayout>
      </NavContainer>
   )
}

export default Navbar
