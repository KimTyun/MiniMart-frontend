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
   const { itemRecent, loading, error } = useSelector((state) => state.item)
   const sellers = useSelector((state) => state.seller.sellers)

   // 최근 등록된 아이템 가져오기
   useEffect(() => {
      dispatch(itemRecentThunk())
   }, [dispatch])

   // 인기 있는 아이템 가져오기(count)
   useEffect(() => {
      dispatch(itemPopularThunk())
   }, [dispatch])

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

   return (
      <div style={{ width: '100%' }}>
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
                        <CardMedia sx={{ height: 400 }} component="img" src={`${VITE_API_URL}${item.ItemImgs[0]?.img_url}`} alt={item.name} />
                        <CardContent>
                           <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
                              {item.name}
                           </Typography>
                           <Typography component="div" sx={{ display: 'flex' }}>
                              <Typography component="span" variant="h5" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                                 {item.Seller?.name}
                              </Typography>
                              <Typography component="span" variant="h5" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                                 →
                              </Typography>
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               )
            })}
         </div>
         {/* 판매자 목록? */}
         <h1 className="seller-h1">판매자 목록</h1>
         <div className="seller-whole">
            {sellers && sellers.length > 0 ? (
               sellers.map((seller) => {
                  return (
                     <div key={seller.id} className="seller-card">
                        <div className="seller-left">
                           <img src={`${seller.User.profile_img}`} alt="" />
                           <h3>{seller.name}</h3>
                           <p>{seller.introduce}</p>
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
         {/* 지금 인기있는 제품들 */}
         <h1 className="popular-h1">지금 인기있는 제품들</h1>
         <div className="popular-whole" style={{ display: 'flex' }}>
            <Card sx={{ maxWidth: 510 }}>
               <CardActionArea>
                  <CardMedia sx={{ height: 525 }} component="img" image="/인기제품/popular1.png" alt="신제품1" />
                  <CardContent>
                     <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
                        썬글라스
                     </Typography>
                     <Typography component="div" sx={{ display: 'flex' }}>
                        <Typography component="span" variant="h6" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                           20대 인기 1위
                        </Typography>
                     </Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
            <Card sx={{ maxWidth: 510 }}>
               <CardActionArea>
                  <CardMedia sx={{ height: 525 }} component="img" image="/인기제품/popular2.png" alt="신제품2" />
                  <CardContent>
                     <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
                        썬글라스
                     </Typography>
                     <Typography component="div" sx={{ display: 'flex' }}>
                        <Typography component="span" variant="h6" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                           10대 인기 1위
                        </Typography>
                     </Typography>
                  </CardContent>
               </CardActionArea>
            </Card>
         </div>
      </div>
   )
}

export default Home
