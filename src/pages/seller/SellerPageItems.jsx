import { useSelector } from 'react-redux'
import '../../styles/sellerPageItems.css'

function SellerPageItems({ items }) {
   return (
      <div className="seller_items">
         {items.map((item) => (
            <div key={item.id} className="seller_card">
               <img src={`${import.meta.env.VITE_API_URL}${item.ItemImgs[0].img_url}`} alt={item.name} className="seller_item_img" />
               <div>{item.name}</div>
               <div>{item.price}원</div>
            </div>
         ))}
      </div>
   )
}

export default SellerPageItems
