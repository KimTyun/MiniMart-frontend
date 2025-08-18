import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersThunk, deleteOrderThunk } from '../../features/adminSlice'
import '../../styles/managerProduct.css'

function ManagerProduct() {
   const dispatch = useDispatch()
   const orders = useSelector((state) => state.admin.orders)

   useEffect(() => {
      dispatch(getAllOrdersThunk())
   }, [dispatch])

   // 삭제 버튼
   const handleDelete = (id) => {
      dispatch(deleteOrderThunk(id))
   }

   return (
      <div>
         <h1>프로덕트 페이지</h1>
         <table className="table">
            <thead>
               <tr>
                  <th>주문 번호</th>
                  <th>주문 상태</th>
                  <th>주문자 닉네임</th>
                  <th>회원 ID</th>
                  <th>주문자 번호</th>
                  <th>주문 상품 개수</th>
                  <th>주문 일자</th>
                  <th>배송지</th>
                  {/* 나중에 총주문 가격으로 바꿀까 고민 */}
                  <th>총 주문 개수</th>
                  <th>주문 관리</th>
               </tr>
            </thead>
            <tbody>
               {orders.map((e) => (
                  <tr key={e.id}>
                     <td>{e.id}</td>
                     <td>{e.status}</td>
                     <td>{e.User?.name}</td>
                     <td>{e.buyer_id}</td>
                     <td>{e.User.phone_number}</td>
                     <td>{e.count}</td>
                     <td>{e.Order_item?.createdAt}</td>
                     <td>{e.User.address}</td>
                     <td>{e.Order_item?.count}</td>
                     <td>
                        <button onClick={() => handleDelete(e.id)}>주문 취소</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default ManagerProduct
