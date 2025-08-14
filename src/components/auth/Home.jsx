import React, { useEffect } from 'react'
import '../../styles/minipage.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserInfoThunk } from '../../features/authSlice'
import { itemPopularThunk, itemRecentThunk } from '../../features/itemSlice'
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

// 백엔드 서버 주소 가져오기
const API_URL = import.meta.env.VITE_API_URL

function Home() {
   var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
   }

   const follow = ['멋있는 모자', '깔끔한 티셔츠', '힙한 바지', '다이아 반지', '커스텀 슈즈']

   const popular = ['10대 인기', '20대 인기', '30대 인기', '40대 인기', '50대 인기']

   const navigate = useNavigate()
   const handleProductClick = (productName) => {
      const mockResults = {
         items: [],
         totalItems: 0,
      }
      navigate('/search', { state: { results: mockResults, searchTerm: productName } })
   }
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const token = useSelector((state) => state.auth.token)
   const { itemRecent, itemPopular, loading, error } = useSelector((state) => state.item)

   useEffect(() => {
      // 컴포넌트 마운트 시 최신, 인기 상품 모두 불러오기
      dispatch(itemRecentThunk())
      dispatch(itemPopularThunk())
   }, [dispatch])

   useEffect(() => {
      // 토큰은 있는데 유저 정보가 없으면 유저 정보 다시 요청
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

         {/* 신제품 출시! */}
         <h1 className="new-h1">신제품 출시 !</h1>
         {loading ? (
            <div>로딩중...</div>
         ) : itemRecent?.items?.length > 0 ? (
            <div className="new-whole">
               {itemRecent.items.map((item) => (
                  <Card key={item.id} sx={{ maxWidth: 345, flexShrink: 0, marginRight: '15px' }}>
                     <CardActionArea>
                        <CardMedia
                           sx={{ height: 500 }}
                           component="img"
                           src={`${API_URL}${item.ItemImgs[0].img_url}` || 'https://placehold.co/345x500?text=No+Image'}
                           alt={item.name}
                           onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'https://placehold.co/345x500?text=Error'
                           }}
                        />

                        <CardContent>
                           <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
                              {item.name}
                           </Typography>
                           <Typography component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography component="span" variant="h6" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                                 {item.Seller?.name || '판매자 정보 없음'}
                              </Typography>
                              <Typography component="span" variant="h5" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                                 →
                              </Typography>
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               ))}
            </div>
         ) : (
            <div>최신 상품이 없습니다.</div>
         )}

         {/* 지금 인기있는 제품들 (상품 구매 구현시 바꿀 예정) */}
         <h1 className="popular-h1">지금 인기있는 제품들</h1>
         <div className="popular-whole">
            {popular.map((e) => {
               return (
                  <Card key={e} sx={{ width: '300px', margin: '30px', flexShrink: 0 }}>
                     <CardActionArea>
                        <CardMedia sx={{ height: 300 }} component="img" height="140" image="/인기제품/popular1.png" alt="신제품1" />
                        <CardContent>
                           <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
                              썬글라스
                           </Typography>
                           <Typography component="div" sx={{ display: 'flex' }}>
                              <Typography component="span" variant="h6" sx={{ color: 'text.secondary', textAlign: 'left' }}>
                                 {e}
                              </Typography>
                           </Typography>
                        </CardContent>
                     </CardActionArea>
                  </Card>
               )
            })}
         </div>
         {/* 팔로잉한 상점들 */}
         {user ? (
            <div>
               <h1>팔로잉한 상점들</h1>
               <div className="follow">
                  {follow.map((e, i) => (
                     <div className="follow-card" key={i}>
                        <div>{e}</div>

                        <div>
                           {user ? (
                              <div className="follow-pro">
                                 <img src={`${API_URL}${user.profile_img}`} alt={`${i}번째이미지`} />
                                 <p className="follow-user">{user.name}</p>
                              </div>
                           ) : (
                              <div className="follow-user">판매자1</div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         ) : (
            <div></div>
         )}
      </div>
   )
}

export default Home
