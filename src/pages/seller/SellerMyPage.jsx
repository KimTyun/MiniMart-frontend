import { Link } from 'react-router-dom'
import '../../styles/seller.css'
import { useState } from 'react'
import SellerMyInfo from './SellerMyInfo'
import SellerMyItem from './SellerMyItem'
function SellerMyPage() {
   const [page, setPage] = useState('MyInfo')
   return (
      <div className="seller_wrap">
         <div className="seller_navbar">
            <Link
               onClick={() => {
                  setPage('MyInfo')
               }}
            >
               내정보
            </Link>

            <Link
               onClick={() => {
                  setPage('MyItem')
               }}
            >
               상품 관리
            </Link>
         </div>
         <div className="seller_pages">{page === 'MyInfo' ? <SellerMyInfo /> : <SellerMyItem />}</div>
      </div>
   )
}

export default SellerMyPage
