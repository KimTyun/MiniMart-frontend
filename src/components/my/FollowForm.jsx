import React, { useState } from 'react'
import '../../styles/mypage.css'

const FollowForm = () => {
   // Redux나 실제 DB 대신, 외부에서 주입될 데이터를 가정하여 상태를 관리합니다.
   const [followings, setFollowings] = useState([
      { id: 'seller_1', name: '빵순이네', avatarUrl: 'https://placehold.co/50x50/ffc0cb/000000?text=빵' },
      { id: 'seller_2', name: '커피의 정석', avatarUrl: 'https://placehold.co/50x50/a9a9a9/ffffff?text=C' },
   ])
   const [loading, setLoading] = useState(false)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [selectedSeller, setSelectedSeller] = useState(null)
   const [message, setMessage] = useState('')

   // 언팔로우 확인 모달을 열기 위한 함수
   const openConfirmModal = (seller) => {
      setSelectedSeller(seller)
      setIsModalOpen(true)
   }

   const handleConfirmUnfollow = async () => {
      if (!selectedSeller) return

      setIsModalOpen(false)
      setMessage('')
      setLoading(true)

      try {
         // 실제 API 호출을 시뮬레이션합니다.
         await new Promise((resolve) => setTimeout(resolve, 1000))

         // 상태를 직접 업데이트하여 해당 판매자를 제거합니다.
         setFollowings((prevFollowings) => prevFollowings.filter((seller) => seller.id !== selectedSeller.id))

         setMessage('판매자를 언팔로우했습니다.')
      } catch (error) {
         setMessage('언팔로우 실패: 네트워크 오류가 발생했습니다.: ', error)
      } finally {
         setLoading(false) // 로딩 상태 종료
         setSelectedSeller(null)
      }
   }

   // 모달에서 '취소'를 눌렀을 때 실행될 로직
   const handleCancelUnfollow = () => {
      setIsModalOpen(false)
      setSelectedSeller(null)
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
                  <button onClick={onConfirm} className="btn-small primary">
                     확인
                  </button>
                  <button onClick={onCancel} className="btn-small secondary">
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
            <h2 className="section-title">팔로잉 목록</h2>

            {message && <p className="loading">{message}</p>}

            {loading && <p className="loading">로딩 중...</p>}

            {!loading && followings.length === 0 && <p className="loading">팔로우한 판매자가 없습니다.</p>}

            {!loading && followings.length > 0 && (
               <div className="following-list">
                  {followings.map((seller) => (
                     <div className="following-item" key={seller.id}>
                        <img src={seller.avatarUrl || 'https://placehold.co/84x84/ffc0cb/000000?text=S'} alt={seller.name} className="following-thumbnail" />
                        <p className="following-nickname">{seller.name}</p>
                        <button className="unfollow-button" onClick={() => openConfirmModal(seller)} disabled={loading} aria-label={`${seller.name} 언팔로우`}>
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
