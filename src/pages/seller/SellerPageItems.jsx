import { useNavigate } from 'react-router-dom'
import '../../styles/sellerPageItems.css'

function SellerPageItems({ items }) {
   const navigate = useNavigate()
   if (!items || items.length === 0) return <div>상품이 없습니다.</div>

   return (
      <div className="seller_items">
         {items.map((item) => (
            <div
               key={item.id}
               className="seller_card"
               onClick={() => {
                  navigate(`/item/${item.id}`)
               }}
            >
               <img src={`${import.meta.env.VITE_API_URL}${item.ItemImgs[0].img_url}`} alt={item.name} className="seller_item_img" />
               <div>{item.name}</div>
               <div>{item.price}원</div>
            </div>
         ))}
      </div>
   )
}

export default SellerPageItems
