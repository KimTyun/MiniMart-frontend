import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecommend } from '../../features/recommendSlice'
import { useNavigate } from 'react-router-dom'
import '../../styles/recommend.css'

const RecommendItems = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user, isAuthenticated } = useSelector((state) => state.auth)
   const { recommend, loading, error } = useSelector((state) => state.recommend)

   useEffect(() => {
      if (isAuthenticated && user) {
         dispatch(fetchRecommend(user.id))
      }
   }, [dispatch, isAuthenticated, user])

   const handleItemClick = (itemId) => {
      navigate(`/items/${itemId}`)
   }

   if (loading) {
      return <div className="recommend-container loading">추천 상품을 불러오는 중입니다...</div>
   }

   // 오류 상태 처리
   if (error) {
      return <div className="recommend-container error">추천 상품을 불러오는 데 실패했습니다: {error}</div>
   }

   // 데이터가 없을 때
   if (recommend.length === 0) {
      return <div className="recommend-container empty">추천 상품이 없습니다.</div>
   }

   return (
      <section className="recommend-section">
         <h2 className="section-title">주문 내역 기반 추천 상품</h2>
         <div className="recommend-list-container">
            {recommend.map((item) => (
               <div key={item.id} className="recommend-item-card" onClick={() => handleItemClick(item.id)}>
                  <img src={item.img || 'https://placehold.co/100x100'} alt={item.name} className="recommend-item-image" />
                  <div className="recommend-item-info">
                     <h3 className="recommend-item-name">{item.name}</h3>
                     <p className="recommend-item-price">{item.price.toLocaleString()}원</p>
                  </div>
               </div>
            ))}
         </div>
      </section>
   )
}

export default RecommendItems
