import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import SellerItemCard from '../../components/item/SellerItemCard'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerItemsThunk } from '../../features/itemSlice'

function SellerMyItem() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { id } = useSelector((s) => s.auth.user)
   const { items } = useSelector((s) => s.item)

   useEffect(() => {
      if (!id) return
      dispatch(getSellerItemsThunk(id))
   }, [dispatch, id])

   return (
      <div className="seller-myItem__wrap">
         <Button onClick={() => navigate('/item/upload')}>상품 등록하기</Button>
         <div className="seller-myItem__itemCards">
            {items &&
               items.map((item, index) => {
                  return <SellerItemCard key={Date.now() + index} item={item} />
               })}
         </div>
      </div>
   )
}

export default SellerMyItem
