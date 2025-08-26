import { useParams } from 'react-router-dom'
import { getSellerItemsThunk } from '../../features/itemSlice'
import '../../styles/sellerPage.css'
import SellerPageItems from './SellerPageItems'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerThunk } from '../../features/sellerSlice'
import { followSellerThunk, unfollowSellerThunk, fetchFollowingSellersThunk } from '../../features/followSlice'

function SellerPage() {
   const { id } = useParams()
   const { items, loading, error } = useSelector((state) => state.item)
   const { sellers, loading: sellerLoading } = useSelector((state) => state.seller)
   const { followingList } = useSelector((state) => state.follow)
   const dispatch = useDispatch()

   // 팔로우 관련 로딩 상태
   const [followLoading, setFollowLoading] = useState(false)
   const [followMessage, setFollowMessage] = useState('')

   useEffect(() => {
      if (id) {
         dispatch(getSellerItemsThunk(id))
      }
   }, [dispatch, id])

   // 판매자 조회
   useEffect(() => {
      dispatch(getSellerThunk())
         .unwrap()
         .then()
         .catch((error) => {
            console.log('Thunk error:', error)
         })
   }, [dispatch])

   // 팔로잉 목록 조회
   useEffect(() => {
      dispatch(fetchFollowingSellersThunk())
   }, [dispatch])

   // 포커스 된 판매자 찾기
   const focusSeller = sellers.find((seller) => seller.id == id)

   // 현재 판매자를 팔로우하고 있는지 확인
   const isFollowing = followingList.some((seller) => seller.id == id)

   // 팔로우/언팔로우 핸들러
   const handleFollowToggle = async () => {
      if (!focusSeller) return

      setFollowLoading(true)
      setFollowMessage('')

      try {
         if (isFollowing) {
            // 언팔로우
            const result = await dispatch(unfollowSellerThunk(focusSeller.id))

            if (unfollowSellerThunk.fulfilled.match(result)) {
               setFollowMessage('언팔로우했습니다.')
            } else {
               throw new Error(result.payload?.message || '언팔로우에 실패했습니다.')
            }
         } else {
            // 팔로우
            const result = await dispatch(followSellerThunk(focusSeller.id))

            if (followSellerThunk.fulfilled.match(result)) {
               setFollowMessage('팔로우했습니다.')
               // 팔로우 성공 시 팔로잉 목록 다시 불러오기
               dispatch(fetchFollowingSellersThunk())
            } else {
               throw new Error(result.payload?.message || '팔로우에 실패했습니다.')
            }
         }
      } catch (error) {
         setFollowMessage(error.message || '오류가 발생했습니다.')
         console.error('팔로우 토글 오류:', error)
      } finally {
         setFollowLoading(false)

         // 메시지를 3초 후 자동으로 제거
         setTimeout(() => {
            setFollowMessage('')
         }, 3000)
      }
   }

   if (loading || sellerLoading) return <div>로딩중...</div>
   if (error) return <div>{error}</div>
   if (!focusSeller) return <div>판매자를 찾을 수 없습니다.</div>

   return (
      <div>
         <div className="seller_top">
            <div className="seller_info">
               <div>
                  <img src={`${focusSeller.banner_img}`} alt={focusSeller.name} />
               </div>
               <div className="seller_details">
                  <p>{focusSeller.name}</p>

                  {/* 팔로우 버튼 */}
                  <button className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`} onClick={handleFollowToggle} disabled={followLoading}>
                     {followLoading ? '처리중...' : isFollowing ? '언팔로우' : '팔로우'}
                  </button>

                  {/* 팔로우 상태 메시지 */}
                  {followMessage && <div className={`follow-message ${followMessage.includes('실패') || followMessage.includes('오류') ? 'error' : 'success'}`}>{followMessage}</div>}
               </div>
            </div>
         </div>
         <div>
            <div className="seller_introduce">
               <p>
                  {focusSeller.introduce.split('<br/>').map((line, index) => {
                     return <span key={index}>{line}</span>
                  })}
               </p>
            </div>
         </div>
         <SellerPageItems items={items} />
      </div>
   )
}

export default SellerPage
