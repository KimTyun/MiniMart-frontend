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
   const dispatch = useDispatch()

   useEffect(() => {
      if (id) {
         dispatch(getSellerItemsThunk(id))
      }
   }, [dispatch, id])

   const sellers = useSelector((state) => state.seller.sellers)
   // 판매자 조회
   useEffect(() => {
      dispatch(getSellerThunk())
         .unwrap()
         .then()
         .catch((error) => {
            console.log('Thunk error:', error)
         })
   }, [dispatch])
   console.log(sellers)

   const findSeller = () => sellers.find((e) => e.id == id)

   console.log(findSeller())

   if (loading) return <div>로딩중...</div>
   if (error) return <div>{error}</div>
   if (!items || items.length === 0) return <div>상품이 없습니다.</div>
   return (
      <div>
         <div className="seller_top">
            <div className="seller_info">
               <div>
                  <img src={`${findSeller().banner_img}`}></img>
               </div>
               <p>{findSeller().name}</p>
            </div>
         </div>
         <div>
            <div className="seller_introduce">
               <p>{findSeller().introduce}</p>
            </div>
         </div>
         {<SellerPageItems items={items} />}
      </div>
   )
}

export default SellerPage
