import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import UserInfoForm from '../components/my/UserInfoForm'
import OrderHistoryForm from '../components/my/OrderHistoryForm'
import FollowForm from '../components/my/FollowForm'
import '../styles/MyPage.css'

const MyPage = () => {
   const navigate = useNavigate()
   const { isAuthenticated, loading, user } = useSelector((state) => state.auth)

   useEffect(() => {
      if (!loading && !isAuthenticated) {
         navigate('/login')
      }
   }, [loading, isAuthenticated, navigate])

   if (loading) {
      return <div className="loading">사용자 정보 불러오는 중...</div>
   }

   if (!isAuthenticated) {
      return null
   }

   return (
      <div className="mypage-container">
         {/* 상단 사용자 정보 */}
         <UserInfoForm />

         {/* 구매 내역 */}
         <OrderHistoryForm />

         {/* 팔로잉 판매자 */}
         <FollowForm />

         {/* 판매자 등록 */}
         <button className="register-seller-btn" onClick={() => navigate('/seller-register')}>
            판매자 등록 신청하기
         </button>
      </div>
   )
}

export default MyPage
