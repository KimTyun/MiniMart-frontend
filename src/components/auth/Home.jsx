import React, { useEffect } from 'react'
import '../../styles/minipage.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserInfoThunk } from '../../features/authSlice'
import { itemPopularThunk, itemRecentThunk } from '../../features/itemSlice'
import { Link } from 'react-router-dom'
import SearchBar from '../shared/SearchBar'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import { fetchFollowingSellersThunk } from '../../features/followSlice'

const VITE_API_URL = import.meta.env.VITE_API_URL

function Home() {
   var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
   }

   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const token = useSelector((state) => state.auth.token)
   const { followingList, loading } = useSelector((state) => state.follow)
   const { itemRecent, error } = useSelector((state) => state.item)

   useEffect(() => {
      if (user) {
         dispatch(fetchFollowingSellersThunk())
      }
   }, [dispatch, user])

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
         <div style={{ display: 'flex', overflowX: 'auto' }}>
            {(itemRecent?.items ?? []).map((item) => {
               return (
                  <Card className="new-card" key={item.id}>
                     <CardActionArea>
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

         {/* 팔로잉한 상점들 섹션 */}
         {user && (
            <div className="follow-whole">
               <h1>팔로잉한 상점들</h1>
               <div className="follow">
                  {loading && <p>로딩 중...</p>}
                  {!loading && followingList && followingList.length > 0
                     ? followingList.map((seller) => (
                          <Link to={`/seller/${seller.id}`} key={seller.id} className="follow-card" style={{ textDecoration: 'none' }}>
                             <div className="follow-pro">
                                <img src={seller.profile_img || '/none_profile_img.webp'} alt={seller.name} />
                                <p>{seller.name}</p>
                             </div>
                          </Link>
                       ))
                     : !loading && <p>팔로우하는 상점이 없습니다.</p>}
               </div>
            </div>
         )}
      </div>
   )
}

export default Home
