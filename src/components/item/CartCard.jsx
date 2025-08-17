import Button from '@mui/material/Button'
import '../../styles/cartCard.css'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { deleteCartItemThunk, getCartsThunk, updateCartItemThunk } from '../../features/orderSlice'

function CartCard({ cartItem }) {
   const dispatch = useDispatch()
   const totalPrice = useMemo(() => {
      return cartItem.count * (cartItem.Item.price + cartItem.ItemOption.price)
   }, [cartItem])

   function onChangeCount(count) {
      return () => {
         dispatch(updateCartItemThunk({ id: cartItem.id, count }))
            .unwrap()
            .then(() => {
               dispatch(getCartsThunk())
            })
      }
   }

   function onDeleteCartItem() {
      dispatch(deleteCartItemThunk(cartItem.id))
         .unwrap()
         .then(() => {
            dispatch(getCartsThunk())
         })
   }

   return (
      <div className="cartCard-wrap">
         <div className="cartCard-img">
            <img src={`${import.meta.env.VITE_API_URL}${cartItem.Item.ItemImgs[0].img_url}`} alt="상품이미지" />
         </div>
         <div className="cartCard-info">
            <p>{cartItem.Item.name}</p>
            <p>{cartItem.ItemOption.name}</p>
            <div className="cartCard-count">
               <button onClick={onChangeCount(-1)}>-</button>
               <p>{cartItem.count}</p>
               <button onClick={onChangeCount(+1)}>+</button>
            </div>
            <p>총 {totalPrice.toLocaleString()}원</p>
            <Button type="button" onClick={onDeleteCartItem}>
               삭제하기
            </Button>
         </div>
         <div className="cartCard-seller-info">
            <div className="seller-info-wrap">
               <img src={cartItem.Item?.Seller?.User?.profile_img ? `${cartItem.Item.Seller.User.profile_img}` : '/public/none_profile_img.webp'} alt="판매자프로필" />
               <p>{cartItem.Item?.Seller?.name}</p>
            </div>
         </div>
      </div>
   )
}

export default CartCard
