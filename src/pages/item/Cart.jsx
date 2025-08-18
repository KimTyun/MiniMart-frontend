import React, { useEffect, useMemo, useState } from 'react'
import CartCard from '../../components/item/CartCard'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { getCartsThunk } from '../../features/orderSlice'
import { useNavigate } from 'react-router-dom'
import { checkAuthStatusThunk } from '../../features/authSlice'

function Cart() {
   const { carts, loading } = useSelector((s) => s.order)
   const [isAuthenticated, setIsAuthenticated] = useState(null) // 👈 초기값 null
   const [authLoading, setLoading] = useState(true)
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
            setLoading(false)
         })

      dispatch(getCartsThunk())
   }, [dispatch, setIsAuthenticated, setLoading])

   useEffect(() => {
      if (isAuthenticated === null) return
      if (!isAuthenticated) {
         if (confirm('로그인이 필요한 화면입니다. 로그인 페이지로 이동하시겠습니까?')) {
            navigate('/login')
         } else {
            navigate('/')
         }
      }
   }, [isAuthenticated])

   if (authLoading || loading) <p>'로딩중...'</p>

   return (
      <>
         <div className="cart">
            {carts && carts?.CartItems?.map((cartItem) => <CartCard cartItem={cartItem} key={Date.now() + cartItem.id} />)}

            <div className="cart-sum">
               <p>합계 금액 : {carts ? totalPrice?.toLocaleString() : '0'}</p>
               <Button>주문하기</Button>
            </div>
         </div>
      </>
   )
}

export default Cart
