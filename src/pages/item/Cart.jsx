import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CartCard from '../../components/item/CartCard'
import Button from '@mui/material/Button'

function Cart() {
   const { id } = useParams()
   useEffect(() => {}, [])

   return (
      <>
         <div className="cart">
            <CartCard />
            <CartCard />
            <CartCard />
            <CartCard />
            <CartCard />
            <div className="cart-sum">
               <p>합계 금액 : 100,000</p>
               <Button>주문하기</Button>
            </div>
         </div>
      </>
   )
}

export default Cart
