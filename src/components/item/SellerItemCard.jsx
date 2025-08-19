import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'
import { deleteItemThunk } from '../../features/itemSlice'
import { useNavigate } from 'react-router-dom'

function SellerItemCard({ item }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   function handleDelete() {
      if (confirm('정말로 상품을 삭제하시겠습니까?')) {
         dispatch(deleteItemThunk(item.id))
            .unwrap()
            .then(() => {
               alert('성공적으로 삭제했습니다.')
               navigate(0)
            })
      }
   }

   function handleUpdate() {
      navigate(`/item/update/${item.id}`)
   }
   return (
      <div className="itemCard__wrap">
         <p>상품아이디 : {item.id}</p>
         <p
            onClick={() => {
               navigate(`/item/${item.id}`)
            }}
         >
            {item.name}
         </p>
         <p>남은 재고 : {item.stock_number}</p>
         <div className="button-wrap">
            <Button onClick={handleUpdate}>수정하기</Button>
            <Button onClick={handleDelete}>삭제하기</Button>
         </div>
      </div>
   )
}

export default SellerItemCard
