import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatusThunk } from '../features/authSlice'

import UserInfoForm from '../components/my/UserInfoForm'
import OrderHistoryForm from '../components/my/OrderHistoryForm'
import FollowForm from '../components/my/FollowForm'
import '../styles/MyPage.css'

const MyPage = () => {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const { isAuthenticated, loading, user } = useSelector((state) => state.auth)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])

   if (loading) {
      return <div className="loading">로그인 상태 확인 중...</div>
   }

   if (!isAuthenticated) {
      navigate('/login')
      return null
   }

   return (
      <div className="mypage-container">
         {/* 상단 사용자 정보 */}
         <UserInfoForm user={user} />

         {/* 구매 내역 */}
         <OrderHistoryForm />

         {/* 팔로잉 판매자 */}
         <FollowForm />
      </div>
   )
}

export default MyPage
