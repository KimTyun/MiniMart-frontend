import React, { useRef, useState } from 'react'
import Select from '@mui/material/Select'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import '../../styles/itemDetail.css'

function ItemDetail() {
   return (
      <>
         <div className="item-detail-wrap">
            <div className="item-detail__rep-wrap">
               <div className="rep-imgs">
                  <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
                     <SwiperSlide>Slide 1</SwiperSlide>
                     <SwiperSlide>Slide 2</SwiperSlide>
                     <SwiperSlide>Slide 3</SwiperSlide>
                     <SwiperSlide>Slide 4</SwiperSlide>
                  </Swiper>
               </div>
               <div className="rep-info">
                  <h2>상품이름</h2>
                  <div className="rep-price">
                     <i>
                        <img src="/public/세일.png" alt="" />
                     </i>
                     <div>
                        <i>
                           <img src="/public/원화.png" alt="" />
                        </i>
                        <p>5000</p>
                     </div>
                  </div>
                  <p>판매자</p>
                  <div className="rep-options">
                     <div className="options__option"></div>
                     <div className="options__number">
                        <InputLabel id="demo-simple-select-label">개수</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={10} label="Age" onChange={handleChange}>
                           <MenuItem value={10}>1</MenuItem>
                           <MenuItem value={20}>2</MenuItem>
                           <MenuItem value={30}>3</MenuItem>
                        </Select>
                     </div>
                  </div>
                  <button>장바구니 담기</button>
                  <div>
                     <p>상품 소개</p>
                     <p>이런저런 소개...</p>
                  </div>
               </div>
            </div>
            <div className="item-detail__another-item">다른 상품들 들어있는 공간</div>
            <div className="item-detail__description-img">상세설명 이미지 들어갈 위치</div>
            <div className="item-detail__review-wrap">리뷰 컴포넌트 들어갈 자리</div>
         </div>
      </>
   )
}

export default ItemDetail
