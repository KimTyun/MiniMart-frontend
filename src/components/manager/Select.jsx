import { useNavigate } from 'react-router-dom'

function Select() {
   const navigate = useNavigate()

   const navStyle = {
      marginRight: '50px',
      padding: '10px',
      backgroundColor: '#e2f53e',
      borderRadius: '5px',
      cursor: 'pointer',
   }

   return (
      <div style={{ display: 'flex', padding: '50px' }}>
         <div style={navStyle} onClick={() => navigate('/manager')}>
            승인 관리
         </div>
         <div style={navStyle} onClick={() => navigate('/manager/product')}>
            상품 관리
         </div>
         <div style={navStyle} onClick={() => navigate('/manager/statistics')}>
            통계
         </div>
         <div style={navStyle} onClick={() => navigate('/manager/qna')}>
            문의 관리
         </div>
      </div>
   )
}

export default Select
