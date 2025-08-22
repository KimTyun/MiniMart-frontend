import React, { useEffect } from 'react'
import '../../styles/minipage.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserInfoThunk } from '../../features/authSlice'
import { itemPopularThunk, itemRecentThunk } from '../../features/itemSlice'
import { getSellerThunk } from '../../features/sellerSlice'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../shared/SearchBar'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'

const VITE_API_URL = import.meta.env.VITE_API_URL

function Home() {
   var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
   }
   const navigator = useNavigate()

   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const token = useSelector((state) => state.auth.token)
   const { itemRecent, itemPopular, loading, error } = useSelector((state) => state.item)
   const sellers = useSelector((state) => state.seller.sellers)

   // 최근 등록된 아이템 가져오기
   useEffect(() => {
      dispatch(itemRecentThunk())
   }, [dispatch])

   // 인기 있는 아이템 가져오기(count)
   useEffect(() => {
      dispatch(itemPopularThunk())
   }, [dispatch])

   // s를 대로 변환
   const ageGroupMap = {
      '10s': '10대',
      '20s': '20대',
      '30s': '30대',
      '40s': '40대',
      '+50s': '+50대',
   }

   // 데이터가 없으면 넘어가고 순서 정해주기
   const ageGroupOrder = ['10s', '20s', '30s', '40s', '+50s']

   const getPopularItems = () => {
      if (!itemPopular?.items) return []

      const grouped = itemPopular.items.reduce((acc, item) => {
         const ageGroup = item.age_group
         if (!acc[ageGroup]) {
            acc[ageGroup] = []
         }
         acc[ageGroup].push(item)
         return acc
      }, {})

      // 순서대로 나열, 데이터가 있는 연령대만 반환
      return ageGroupOrder
         .filter((ageGroup) => grouped[ageGroup] && grouped[ageGroup].length > 0)
         .map((ageGroup) => ({
            ageGroup,
            displayName: ageGroupMap[ageGroup],
            items: grouped[ageGroup],
         }))
   }

   const popularItems = getPopularItems()

   useEffect(() => {
      if (token && !user) {
         dispatch(fetchUserInfoThunk())
      }
   }, [dispatch, token, user])

   // 판매자 조회
   useEffect(() => {
      dispatch(getSellerThunk())
         .unwrap()
         .then()
         .catch((error) => {
            console.log('Thunk error:', error)
         })
   }, [dispatch])

   // 프로필 이미지 처리 함수
   const getProfileImage = (profileImg) => {
      // 빈 문자열, null, undefined, 또는 uploads/profile-images/default.png 같은 기본값일 때
      if (!profileImg || profileImg === '/uploads/profile-images/default.png') {
         return '/none_profile_img.png'
      }
      return profileImg
   }

   return (
      <div className="home-container">
         {/* 검색하는 부분 */}
         <SearchBar />
         <div className="slider">
            {/* 슬라이드 부분 */}
            <Slider {...settings}>
               <div>
                  <img src="/slide1.jpg" alt="slide1" />
               </div>
               <div>
                  <img src="/slide2.jpg" alt="slide2" />
               </div>
               <div>
                  <img src="/slide3.jpg" alt="slide3" />
               </div>
               <div>
                  <img src="/slide4.jpg" alt="slide4" />
               </div>
            </Slider>
         </div>
         {/* 신제품 출시 */}
         <h1 className="new-h1">신제품 출시 !</h1>
         {loading && <div>로딩중...</div>}
         {error && <div>{error}</div>}
         <div className="new-whole">
            {(itemRecent?.items ?? []).map((item) => {
               return (
                  <Card className="new-card" key={item.id}>
                     <CardActionArea
                        onClick={() => {
                           navigator(`/item/${item.id}`)
                        }}
                     >
                        <CardMedia className="new-card-media" component="img" src={`${VITE_API_URL}${item.ItemImgs[0]?.img_url}`} alt={item.name} />
                        <CardContent>
                           <Typography className="new-card-title" gutterBottom variant="h5" component="div">
                              {item.name}
                           </Typography>
                           <Typography className="new-card-info" component="div">
                              <Typography className="new-card-img" component="img" src={item.Seller?.banner_img} alt={item.id} variant="h5"></Typography>
                              <Typography className="new-card-seller" component="span" variant="h5">
                                 {item.Seller?.name}
                              </Typography>
                              <Typography className="new-card-arrow" component="span" variant="h5">
                                 →
                              </Typography>
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               )
            })}
         </div>

         {/* 지금 인기있는 제품들 */}
         <h1 className="popular-h1">지금 인기있는 제품들</h1>
         <div className="popular-whole">
            {popularItems.length > 0 ? (
               popularItems.map(({ ageGroup, displayName, items }) =>
                  items.map((item, index) => (
                     <Card key={`${ageGroup}-${index}`} className="popular-card">
                        <CardActionArea
                           onClick={() => {
                              navigator(`/item/${item.item_id}`)
                           }}
                        >
                           <CardMedia className="popular-card-media" component="img" image={`${VITE_API_URL}${item.rep_img_url}`} alt={item.item_name} />
                           <CardContent>
                              <Typography className="popular-card-title" gutterBottom variant="h5" component="div">
                                 {item.item_name}
                              </Typography>
                              <Typography className="popular-card-info" component="div">
                                 <Typography className="new-card-img" component="img" src={item.banner_img} alt={item.id} variant="h6"></Typography>
                                 <Typography className="popular-card-seller" component="span" variant="h6">
                                    {item.seller_name}
                                 </Typography>
                                 <Typography className="popular-card-rank" component="span" variant="h6">
                                    {displayName} 인기 1위
                                 </Typography>
                              </Typography>
                           </CardContent>
                        </CardActionArea>
                     </Card>
                  ))
               )
            ) : (
               <div>인기 상품이 없습니다.</div>
            )}
         </div>
         {/* 판매자 목록 */}
         <h1 className="seller-h1">판매자 목록</h1>
         <div className="seller-whole">
            {sellers && sellers.length > 0 ? (
               sellers.map((seller) => {
                  return (
                     <div
                        onClick={() => {
                           navigator(`/seller/${seller.id}`)
                        }}
                        key={seller.id}
                        className="seller-card"
                     >
                        <div className="seller-left">
                           <img src={getProfileImage(seller.User?.profile_img)} alt={`${seller.id}이미지`} />
                           <h3>{seller.name}</h3>
                        </div>
                        <div className="seller-right">
                           <p>주요 상품: {seller.main_products}</p>
                           {seller.banner_img && <img src={seller.banner_img} alt={seller.name} />}
                        </div>
                     </div>
                  )
               })
            ) : (
               <div>판매자가 없습니다.</div>
            )}
         </div>
      </div>
   )
}

export default Home
