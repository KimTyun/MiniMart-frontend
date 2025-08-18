import Button from '@mui/material/Button'

function SellerItemCard({ item }) {
   return (
      <div className="itemCard__wrap">
         <p>상품아이디 : {item.id}</p>
         <p>{item.name}</p>
         <p>남은 재고 : {item.stock_number}</p>
         <div className="button-wrap">
            <Button>수정하기</Button>
            <Button>삭제하기</Button>
         </div>
      </div>
   )
}

export default SellerItemCard
