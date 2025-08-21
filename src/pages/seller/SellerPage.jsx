import { useParams } from 'react-router-dom'
import { getSellerItemsThunk } from '../../features/itemSlice'
import '../../styles/sellerPage.css'
import SellerPageItems from './SellerPageItems'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerThunk } from '../../features/sellerSlice'

function SellerPage() {
   const { id } = useParams()
   const { items, loading, error } = useSelector((state) => state.item)
   const { sellers, loading: sellerLoading } = useSelector((state) => state.seller)
   const dispatch = useDispatch()

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

   // 포커스 된 판매자 찾기
   const focusSeller = sellers.find((seller) => seller.id == id)

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
               <p>{focusSeller.name}</p>
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
