import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import minimartApi from '../api/axiosApi'
import { useSelector, useDispatch } from 'react-redux'
import { followSellerThunk, unfollowSellerThunk } from '../features/followSlice'

const SellerPage = () => {
   const { sellerId } = useParams() // URL에서 sellerId를 가져옵니다. (문자열 형태)
   const [items, setItems] = useState([])
   const [sellerInfo, setSellerInfo] = useState(null)
   const [loading, setLoading] = useState(true)

   const dispatch = useDispatch()
   const { user } = useSelector((state) => state.auth)
   const { followingList } = useSelector((state) => state.follow)

   const isFollowing = followingList.some((seller) => seller.id === parseInt(sellerId))

   useEffect(() => {
      const fetchItemsAndSeller = async () => {
         try {
            setLoading(true)
            const response = await minimartApi.get(`/api/seller/${sellerId}/items`)
            setItems(response.data.data)

            if (response.data.data.length > 0) {
               setSellerInfo(response.data.data[0].Seller)
            }
         } catch (error) {
            console.error('판매자 페이지 로딩 실패:', error)
         } finally {
            setLoading(false)
         }
      }
      fetchItemsAndSeller()
   }, [sellerId])

   const handleFollowToggle = () => {
      if (!user) {
         alert('로그인이 필요합니다.')
         return
      }

      if (isFollowing) {
         dispatch(unfollowSellerThunk(sellerId))
      } else {
         dispatch(followSellerThunk(sellerId))
      }
   }

   const styles = {
      container: { maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' },
      title: { fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' },
      grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' },
      card: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none', color: 'inherit' },
      img: { width: '100%', height: '250px', objectFit: 'cover', backgroundColor: '#f0f0f0' },
      info: { padding: '1rem' },
      sellerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
      followButton: { padding: '0.6rem 1.2rem', border: '1px solid black', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
   }

   if (loading) return <div>로딩 중...</div>

   return (
      <div style={styles.container}>
         <div style={styles.sellerHeader}>
            <h1 style={styles.title}>{sellerInfo ? `${sellerInfo.name}님의 상품 목록` : '상품 목록'}</h1>
            {user && (
               <button
                  onClick={handleFollowToggle}
                  style={{
                     ...styles.followButton,
                     backgroundColor: isFollowing ? 'white' : 'black',
                     color: isFollowing ? 'black' : 'white',
                  }}
               >
                  {isFollowing ? '언팔로우' : '팔로우'}
               </button>
            )}
         </div>

         <div style={styles.grid}>
            {items.map((item) => (
               <Link to={`/item/${item.id}`} key={item.id} style={styles.card}>
                  <img src={item.ItemImgs[0]?.img_url || '/placeholder.png'} alt={item.name} style={styles.img} />
                  <div style={styles.info}>
                     <p>{item.name}</p>
                     <p style={{ fontWeight: 'bold' }}>{item.price.toLocaleString()}원</p>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}

export default SellerPage
