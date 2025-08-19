import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerThunk } from '../../features/mypageSlice'
import { useState } from 'react'
import Button from '@mui/material/Button'
import { updateSellerThunk } from '../../features/sellerSlice'
import { useNavigate } from 'react-router-dom'

function SellerMyInfo() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { seller } = useSelector((s) => s.mypage)
   const [data, setData] = useState({ name: '', introduce: '', phone_number: '' })
   const { user } = useSelector((s) => s.auth)

   useEffect(() => {
      dispatch(getSellerThunk())
   }, [dispatch])

   useEffect(() => {
      if (!seller) return
      setData({ name: seller.name, introduce: seller.introduce, phone_number: seller.phone_number })
   }, [seller])

   function onChangeSellerInfo(e) {
      e.preventDefault()
      dispatch(updateSellerThunk({ id: user.id, name: data.name, introduce: data.introduce, phone_number: data.phone_number }))
         .unwrap()
         .then(() => {
            alert('수정되었습니다!')
            navigate(0)
         })
   }

   return (
      <>
         {seller && (
            <div className="seller-myInfo__wrap">
               <div className="seller-myInfo__status">
                  <h3>{seller.status === 'APPROVED' ? '' : seller.status === 'PENDING' ? '승인 대기중입니다.' : '승인이 거절되었습니다.'}</h3>
               </div>
               <div className="seller-myInfo__form-wrap">
                  <form onSubmit={onChangeSellerInfo}>
                     <label htmlFor="name">이름</label>
                     <input type="text" id="name" value={data.name} onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))} />
                     <label htmlFor="introduce">자기소개</label>
                     <input type="text" id="introduce" value={data.introduce} onChange={(e) => setData((prev) => ({ ...prev, introduce: e.target.value }))} />
                     <label htmlFor="introduce">휴대폰 번호</label>
                     <input type="text" id="introduce" value={data.phone_number} onChange={(e) => setData((prev) => ({ ...prev, phone_number: e.target.value }))} />
                     <label htmlFor="biz_reg_no">사업자 번호</label>
                     <input type="text" id="biz_reg_no" readOnly value={seller.biz_reg_no} />
                     <label htmlFor="representative_name">사업자명</label>
                     <input type="text" id="representative_name" readOnly value={seller.representative_name} />
                     <label htmlFor="main_products">메인 프로덕트</label>
                     <input type="text" id="main_products" readOnly value={seller.main_products} />
                     <label htmlFor="main_products">사업장 주소</label>
                     <input type="text" id="main_products" readOnly value={seller.business_address} />
                     <Button type="submit">수정하기</Button>
                  </form>
               </div>
            </div>
         )}
      </>
   )
}

export default SellerMyInfo
