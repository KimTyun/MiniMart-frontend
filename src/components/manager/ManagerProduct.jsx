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

   // 날짜 포맷팅 함수
   const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
         hour: '2-digit',
         minute: '2-digit',
      })
   }

   console.log(orders)

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
                  <th>총 주문 개수</th>
                  <th>주문 관리</th>
               </tr>
            </thead>
            <tbody>
               {orders.map((order) => (
                  <tr key={order.id}>
                     <td>{order.id}</td>
                     <td>{order.status}</td>
                     <td>{order.User?.name}</td>
                     <td>{order.User?.email}</td>
                     <td>{order.User?.phone_number}</td>
                     <td>{order.OrderItems?.length || 0}개 상품</td>
                     <td>{formatDate(order.createdAt || order.OrderItems?.[0]?.createdAt)}</td>
                     <td>{order.User?.address}</td>
                     <td>{order.OrderItems?.reduce((total, item) => total + (item.count || 0), 0) || 0}개</td>
                     <td>
                        <button onClick={() => handleDelete(order.id)}>주문 취소</button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   )
}

export default ManagerProduct
