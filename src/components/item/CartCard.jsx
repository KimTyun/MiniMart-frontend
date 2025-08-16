import Button from '@mui/material/Button'
import '../../styles/cartCard.css'

function CartCard() {
   return (
      <div className="cartCard-wrap">
         <div className="cartCard-img">
            <img src="/public/none_profile_img.webp" alt="" />
         </div>
         <div className="cartCard-info">
            <p>상품 이름</p>
            <p>상품 옵션</p>
            <div className="cartCard-count">
               <button>-</button>
               <p>10</p>
               <button>+</button>
            </div>
            <p>총 10,000원</p>
            <Button type="button">삭제하기</Button>
         </div>
         <div className="cartCard-seller-info">
            <div className="seller-info-wrap">
               <img src="/public/none_profile_img.webp" alt="" />
               <p>판매자</p>
            </div>
         </div>
      </div>
   )
}

export default CartCard
