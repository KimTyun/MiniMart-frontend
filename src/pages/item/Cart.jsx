import React, { useEffect, useMemo, useState } from 'react'
import CartCard from '../../components/item/CartCard'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { addOrderThunk, getCartsThunk } from '../../features/orderSlice'
import { useNavigate } from 'react-router-dom'
import { checkAuthStatusThunk } from '../../features/authSlice'

function Cart() {
   const { carts } = useSelector((s) => s.order)
   const { user } = useSelector((s) => s.auth)
   const [isAuthenticated, setIsAuthenticated] = useState(null)
   const [emptyCart, setEmptyCart] = useState(false)

   const navigate = useNavigate()
   const dispatch = useDispatch()
   const totalPrice = useMemo(() => {
      return carts?.CartItems?.reduce((acc, item) => acc + item.count * (item.Item.price + item.ItemOption.price), 0)
   }, [carts])
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
         .unwrap()
         .then((result) => {
            setIsAuthenticated(result.isAuthenticated)
         })

      dispatch(getCartsThunk())
         .unwrap()
         .then()
         .catch((err) => {
            if (err === '장바구니 없음') {
               setEmptyCart(true)
            }
         })
   }, [dispatch, setIsAuthenticated])

   useEffect(() => {
      if (isAuthenticated === null) return
      if (!isAuthenticated) {
         if (confirm('로그인이 필요한 화면입니다. 로그인 페이지로 이동하시겠습니까?')) {
            navigate('/login')
         } else {
            navigate('/')
         }
      }
   }, [isAuthenticated, navigate])

   function handleOrder() {
      const data = { id: user.id, items: carts?.CartItems }
      dispatch(addOrderThunk(data))
         .unwrap()
         .then(() => {
            alert('주문이 완료되었습니다')
            navigate('/')
         })
         .catch((e) => {
            alert(e)
         })
   }

   // 조건 검사에 !carts?.CartItems 추가
   if (emptyCart || !carts?.CartItems || carts?.CartItems?.length == 0) {
      return (
         <div className="cart">
            <h2>장바구니가 비어있습니다.</h2>
            <Button
               className="goShopping_btn"
               sx={{ color: 'white', backgroundColor: 'rgb(250, 204, 21)', fontWeight: 'bold', width: '200px', margin: '0 auto' }}
               onClick={() => {
                  navigate('/search')
               }}
            >
               지금 쇼핑하러 가기
            </Button>
         </div>
      )
   }
   return (
      <>
         <div className="cart">
            {carts && carts?.CartItems?.map((cartItem) => <CartCard cartItem={cartItem} key={Date.now() + cartItem.id} />)}
            <div className="cart-sum">
               <p>합계 금액 : {carts ? totalPrice?.toLocaleString() : '0'}</p>
               {carts && <Button onClick={handleOrder}>주문하기</Button>}
            </div>
         </div>
      </>
   )
}

export default Cart
