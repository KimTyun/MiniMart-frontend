import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyPageThunk, updateMyPageThunk, deleteAccountThunk } from '../../features/mypageSlice'
import { logoutUserThunk } from '../../features/authSlice'
import { useDaumPostcodePopup } from 'react-daum-postcode'

const API_BASE_URL = import.meta.env.VITE_API_URL

const Modal = ({ message, isConfirm, onClose, onConfirm }) => {
   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <p>{message}</p>
            <div className="modal-actions">
               {isConfirm && (
                  <button className="modal-confirm-btn" onClick={onConfirm}>
                     확인
                  </button>
               )}
               <button className="modal-close-btn" onClick={onClose}>
                  {isConfirm ? '취소' : '확인'}
               </button>
            </div>
         </div>
      </div>
   )
}

const UserInfoForm = () => {
   const fileInputRef = useRef(null)
   const dispatch = useDispatch()
   const { user, loading, error } = useSelector((state) => state.mypage)
   const [previewImage, setPreviewImage] = useState('')
   const token = localStorage.getItem('token')
   const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
   const open = useDaumPostcodePopup(scriptUrl)

   const [formData, setFormData] = useState({
      name: '',
      phone_number: '',
      email: '',
      zipcode: '',
      address: '',
      detailaddress: '',
      extraaddress: '',
      profile_img: '',
   })
   const [originalData, setOriginalData] = useState(null)

   const [modalState, setModalState] = useState({
      show: false,
      message: '',
      isConfirm: false,
      onConfirm: () => {},
   })

   const closeModal = () => {
      setModalState({ show: false, message: '', isConfirm: false, onConfirm: () => {} })
   }

   const handleChange = (e) => {
      let { name, value } = e.target
      if (name === 'phone_number') {
         value = value.replace(/[^0-9]/g, '')
      }
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   useEffect(() => {
      dispatch(fetchMyPageThunk('/mypage'))
   }, [dispatch])

   useEffect(() => {
      if (user) {
         setOriginalData(user)
         setFormData({
            name: user.name || '',
            phone_number: user.phone_number || '',
            email: user.email || '',
            zipcode: user.zipcode || '',
            address: user.address || '',
            detailaddress: user.detailaddress || '',
            extraaddress: user.extraaddress || '',
            profile_img: user.profile_img || '',
         })

         const fullImageUrl = user.profile_img && user.profile_img.trim() !== '' ? (user.profile_img.startsWith('http') ? user.profile_img : `${API_BASE_URL}${user.profile_img}`) : `${API_BASE_URL}/uploads/profile-images/default.png`
         setPreviewImage(fullImageUrl)
      }
   }, [user])

   const handleImageClick = () => {
      fileInputRef.current?.click()
   }

   const handleAddressSearch = () => {
      open({
         onComplete: (data) => {
            let roadAddr = data.roadAddress
            let extraAddr = ''

            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
               extraAddr += data.bname
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
               extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
            }
            if (extraAddr !== '') {
               extraAddr = `(${extraAddr})`
            }

            setFormData((prev) => ({
               ...prev,
               zipcode: data.zonecode,
               address: roadAddr,
               extraaddress: extraAddr,
               detailaddress: '',
            }))
         },
      })
   }

   const handleSave = async () => {
      if (loading) return

      if (!originalData) {
         console.error('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
         return
      }

      const updatedFields = Object.keys(formData).reduce((acc, key) => {
         if (formData[key] !== originalData[key]) {
            acc[key] = formData[key]
         }
         return acc
      }, {})

      if (Object.keys(updatedFields).length === 0) {
         alert('변경된 내용이 없습니다.')
         return
      }

      try {
         await dispatch(updateMyPageThunk(updatedFields)).unwrap()
         alert('수정사항이 성공적으로 적용되었습니다.')
      } catch (error) {
         console.error('업데이트 실패 에러:', error)
         alert(`수정 실패: ${error.message || error.data?.message || '알 수 없는 오류가 발생했습니다.'}`)
      }
   }

   const handleDeleteAccount = async () => {
      setModalState({
         show: true,
         message: '정말 회원탈퇴 하시겠습니까?',
         isConfirm: true,
         onConfirm: async () => {
            try {
               await dispatch(deleteAccountThunk()).unwrap()
               setModalState({ show: true, message: '정상적으로 탈퇴 되었습니다.', isConfirm: false })
               await dispatch(logoutUserThunk()).unwrap()
               window.location.href = '/'
            } catch (err) {
               console.error('회원 탈퇴 실패:', err)
               setModalState({
                  show: true,
                  message: `회원 탈퇴 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}`,
                  isConfirm: false,
               })
            }
         },
      })
   }

   const handleFileChange = async (e) => {
      const file = e.target.files[0]
      if (file && file.type.startsWith('image/')) {
         const reader = new FileReader()
         reader.onloadend = () => setPreviewImage(reader.result)
         reader.readAsDataURL(file)

         try {
            const uploadedImageUrl = await uploadProfileImage(file)
            setFormData((prev) => ({ ...prev, profile_img: uploadedImageUrl }))
         } catch (error) {
            alert('이미지 업로드 실패')
            setPreviewImage(originalData.profile_img ? `${API_BASE_URL}${originalData.profile_img}` : `${API_BASE_URL}/uploads/profile-images/default.png`)
         }
      } else {
         alert('이미지 파일만 선택해주세요.')
      }
   }

   const uploadProfileImage = async (file) => {
      const formData = new FormData()
      formData.append('profileImage', file)

      const response = await fetch(`${API_BASE_URL}/mypage/uploads/profile-images`, {
         method: 'POST',
         headers: { Authorization: `Bearer ${token}` },
         body: formData,
         credentials: 'include',
      })

      if (!response.ok) throw new Error('업로드 실패')
      const data = await response.json()
      return data.url
   }

   if (loading && !user) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error.message || '데이터를 불러오는 데 실패했습니다.'}</p>

   return (
      <div className="user-info-box">
         {loading && !user && <p className="loading">로딩 중...</p>}
         {error && <p className="error">에러: {error}</p>}

         <div className="user-info-left" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
            <img className="user-profile-img" src={previewImage || `${API_BASE_URL}/uploads/profile-images/default.png`} alt="프로필" style={{ cursor: 'pointer' }} />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
         </div>

         <div className="profile-card">
            <div className="profile-row">
               <label htmlFor="name">이름</label>
               <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
            </div>

            <div className="profile-row">
               <label htmlFor="phone_number">전화번호</label>
               <input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} placeholder="01012345678" maxLength="11" onChange={handleChange} />
            </div>

            <div className="profile-row">
               <label htmlFor="email">이메일</label>
               <input id="email" name="email" type="email" value={formData.email} placeholder="가입시 입력한 이메일은 변경할 수 없습니다." readOnly />
            </div>

            <div className="profile-row">
               <label htmlFor="zipcode">우편번호</label>
               <div className="address-input-group">
                  <input id="zipcode" name="zipcode" type="text" value={formData.zipcode} readOnly placeholder="우편번호" />
                  <button type="button" className="postcode-button" onClick={handleAddressSearch}>
                     우편번호 찾기
                  </button>
               </div>
            </div>
            <div className="profile-row">
               <label htmlFor="address">주소</label>
               <input id="address" name="address" type="text" value={formData.address} readOnly placeholder="주소" />
            </div>
            <div className="profile-row">
               <label htmlFor="detailaddress">상세 주소</label>
               <input id="detailaddress" name="detailaddress" type="text" value={formData.detailaddress} onChange={handleChange} placeholder="상세 주소" />
            </div>
            <div className="profile-row">
               <label htmlFor="extraaddress">참고항목</label>
               <input id="extraaddress" name="extraaddress" type="text" value={formData.extraaddress} readOnly placeholder="참고항목" />
            </div>

            {modalState.show && <Modal message={modalState.message} isConfirm={modalState.isConfirm} onClose={closeModal} onConfirm={modalState.onConfirm} />}
            <button className="btn btn-save" onClick={handleSave} disabled={loading}>
               {loading ? '저장 중...' : '정보 수정'}
            </button>
            <button className="btn btn-withdraw" onClick={handleDeleteAccount} disabled={loading}>
               회원 탈퇴
            </button>
         </div>
      </div>
   )
}

export default UserInfoForm
