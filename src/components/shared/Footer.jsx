import React from 'react'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import '../../styles/footer.css'

const Footer = () => {
   return (
      <footer className="footer">
         <div className="footer-container">
            <div className="footer-section">
               <h3 className="footer-main-title">MINIMART</h3>
               <p className="footer-description">MINIMART와 함께 artisan을 만나보세요.</p>
               <div className="footer-social-icons">
                  <FacebookIcon />
                  <InstagramIcon />
                  <TwitterIcon />
                  <LinkedInIcon />
               </div>
            </div>

            <div className="footer-section">
               <h3 className="footer-title">제품 목록</h3>
               <Link to="/about" className="footer-link">
                  브랜드 소개
               </Link>
               <Link to="/about" className="footer-link">
                  매장
               </Link>
               <Link to="" className="footer-link">
                  수공예품
               </Link>
               <Link to="" className="footer-link">
                  판매자 전체 보기
               </Link>
            </div>

            <div className="footer-section">
               <h3 className="footer-title">고객 서비스</h3>
               <Link to="/customer-service" className="footer-link">
                  주문 배송 조회
               </Link>
               <Link to="/customer-service" className="footer-link">
                  반품 신청
               </Link>
               <Link to="/customer-service" className="footer-link">
                  배송 서비스
               </Link>
               <Link to="/customer-service" className="footer-link">
                  FAQ
               </Link>
            </div>

            <div className="footer-section">
               <h3 className="footer-title">Company</h3>
               <Link to="/privacy" className="footer-link">
                  Terms & conditions
               </Link>
               <Link to="/privacy" className="footer-link">
                  Privacy Policy
               </Link>
            </div>
         </div>
      </footer>
   )
}

export default Footer
