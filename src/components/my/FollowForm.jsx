import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFollowingSellersThunk, unfollowSellerThunk } from '../../features/followSlice'
import '../../styles/mypage.css'

const FollowForm = () => {
   // Redux state와 dispatch
   const dispatch = useDispatch()
   const { followingList, loading, error } = useSelector((state) => state.follow)

   // 로컬 state
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedSeller, setSelectedSeller] = useState(null)
   const [message, setMessage] = useState('')
   const [unfollowLoading, setUnfollowLoading] = useState(false)

   // 컴포넌트 마운트시 팔로잉 목록 로드
   useEffect(() => {
      dispatch(fetchFollowingSellersThunk())
   }, [dispatch])

   // 언팔로우 확인 모달을 열기 위한 함수
   const openConfirmModal = (seller) => {
      setSelectedSeller(seller)
      setIsModalOpen(true)
   }

   const handleConfirmUnfollow = async () => {
      if (!selectedSeller) return

      setIsModalOpen(false)
      setMessage('')
      setUnfollowLoading(true)

      try {
         // Redux thunk를 통한 API 호출
         const result = await dispatch(unfollowSellerThunk(selectedSeller.id))

         if (unfollowSellerThunk.fulfilled.match(result)) {
            setMessage('판매자를 언팔로우했습니다.')
         } else {
            throw new Error(result.payload?.message || '언팔로우에 실패했습니다.')
         }
      } catch (error) {
         setMessage('언팔로우 실패: ' + (error.message || '네트워크 오류가 발생했습니다.'))
         console.error('언팔로우 오류:', error)
      } finally {
         setUnfollowLoading(false)
         setSelectedSeller(null)

         // 성공 메시지를 3초 후 자동으로 제거
         setTimeout(() => {
            setMessage('')
         }, 3000)
      }
   }

   // 모달에서 '취소'를 눌렀을 때 실행될 로직
   const handleCancelUnfollow = () => {
      setIsModalOpen(false)
      setSelectedSeller(null)
   }

   // 새로고침 함수
   const handleRefresh = () => {
      setMessage('')
      dispatch(fetchFollowingSellersThunk())
   }

   // 확인 모달 컴포넌트
   const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
      if (!isOpen) {
         return null
      }
      return (
         <div className="modal-overlay">
            <div className="modal-content">
               <h3>{message}</h3>
               <div className="modal-buttons">
                  <button onClick={onConfirm} className="btn-small primary" disabled={unfollowLoading}>
                     {unfollowLoading ? '처리중...' : '확인'}
                  </button>
                  <button onClick={onCancel} className="btn-small secondary" disabled={unfollowLoading}>
                     취소
                  </button>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="mypage-container">
         <section>
            <div className="section-header">
               <h2 className="section-title">팔로잉 목록</h2>
               <button onClick={handleRefresh} className="btn-small secondary" disabled={loading}>
                  {loading ? '로딩중...' : '새로고침'}
               </button>
            </div>

            {loading && <p className="loading">로딩 중...</p>}
            {error && <p className="error">오류: {error.message || '데이터를 불러오는데 실패했습니다.'}</p>}
            {!loading && !error && followingList.length === 0 && <p className="empty-state">팔로우한 판매자가 없습니다.</p>}

            {message && <p className={message.includes('실패') ? 'error' : 'success-message'}>{message}</p>}

            {!loading && followingList.length > 0 && (
               <div className="following-list">
                  {followingList.map((seller) => (
                     <div className="following-item" key={seller.id}>
                        <img src={seller.banner_img || seller.profile_img || 'https://placehold.co/84x84/ffc0cb/000000?text=S'} alt={seller.name} className="following-thumbnail" />
                        <p className="following-nickname">{seller.name}</p>
                        <button className="unfollow-button" onClick={() => openConfirmModal(seller)} disabled={loading || unfollowLoading} aria-label={`${seller.name} 언팔로우`}>
                           언팔로우
                        </button>
                     </div>
                  ))}
               </div>
            )}

            <ConfirmModal isOpen={isModalOpen} message={`'${selectedSeller?.name}' 판매자를 정말 언팔로우하시겠습니까?`} onConfirm={handleConfirmUnfollow} onCancel={handleCancelUnfollow} />
         </section>
      </div>
   )
}

export default FollowForm
