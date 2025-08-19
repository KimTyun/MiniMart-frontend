import { useState, useEffect, useCallback } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import minimartApi from '../api/axiosApi'

import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import '../styles/SearchPage.css'
import SearchBar from '../components/shared/SearchBar'

const searchItemsAPI = async (params) => {
   try {
      const response = await minimartApi.get('/api/item/search', { params })
      return response.data?.data
   } catch (error) {
      console.error('Error searching items:', error)
      return { items: [], totalItems: 0, error: '검색 중 오류가 발생했습니다.' }
   }
}

const SearchPage = () => {
   const location = useLocation()
   const navigate = useNavigate()

   const [results, setResults] = useState({ items: [], totalItems: 0 })
   const [isLoading, setIsLoading] = useState(true)

   const params = new URLSearchParams(location.search)
   const [searchTerm, setSearchTerm] = useState(params.get('keyword') || '')
   const [priceRange, setPriceRange] = useState([parseInt(params.get('minPrice'), 10) || 0, parseInt(params.get('maxPrice'), 10) || 10000000])

   const runSearch = useCallback(async (currentSearchTerm, currentPrice) => {
      setIsLoading(true)
      const searchParams = {
         keyword: currentSearchTerm,
         minPrice: currentPrice[0],
         maxPrice: currentPrice[1],
      }
      const searchResult = await searchItemsAPI(searchParams)
      setResults(searchResult || { items: [], totalItems: 0 })
      setIsLoading(false)
   }, [])

   useEffect(() => {
      const handler = setTimeout(() => {
         const newParams = new URLSearchParams()
         if (searchTerm) newParams.set('keyword', searchTerm)
         if (priceRange[0] > 0) newParams.set('minPrice', priceRange[0])
         if (priceRange[1] < 10000000) newParams.set('maxPrice', priceRange[1])
         navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })

         runSearch(searchTerm, priceRange)
      }, 500) // 0.5초 디바운싱
      return () => clearTimeout(handler)
   }, [searchTerm, priceRange, runSearch, navigate, location.pathname])

   const handlePriceInputChange = (index, value) => {
      const newPriceRange = [...priceRange]
      const numericValue = parseInt(value.replace(/,/g, ''), 10) || 0
      newPriceRange[index] = numericValue
      setPriceRange(newPriceRange)
   }

   const renderResults = () => {
      if (isLoading) {
         return <div className="loading-text">상품을 찾고 있습니다...</div>
      }
      if (results.error) {
         return (
            <div className="error-message">
               <p>{results.error}</p>
            </div>
         )
      }

      if (!results || !Array.isArray(results.items) || results.items.length === 0) {
         if (!searchTerm) {
            return <p>검색어를 입력하여 상품을 찾아보세요.</p>
         }
         return (
            <div className="no-results">
               <h2>검색 결과가 없습니다</h2>
               <p>'{searchTerm}'에 대한 검색 결과를 찾을 수 없습니다.</p>
            </div>
         )
      }

      return (
         <div className="results-grid">
            {results.items.map((item) => {
               const imageUrl = item.ItemImgs && item.ItemImgs.length > 0 ? `${import.meta.env.VITE_API_URL}${item.ItemImgs[0].img_url}` : `/placeholder.png`
               const sellerName = item.Seller?.name || '판매자 정보 없음'
               const itemName = item.name || '이름 없는 상품'
               const itemPrice = typeof item.price === 'number' ? `${item.price.toLocaleString()}원` : '가격 문의'

               return (
                  <Link to={`/item/${item.id}`} key={item.id} className="product-card">
                     <img src={imageUrl} alt={itemName} className="product-image" />
                     <div className="product-info">
                        <p className="product-seller">{sellerName}</p>
                        <h3 className="product-name">{itemName}</h3>
                        <div className="product-price">{itemPrice}</div>
                     </div>
                  </Link>
               )
            })}
         </div>
      )
   }
   return (
      <>
         <SearchBar />

         <div className="search-page-container">
            <aside className="search-filter-section">
               <div className="filter-box">
                  <h3 className="filter-title">가격 설정</h3>
                  <Box sx={{ padding: '0 10px' }}>
                     <Slider value={priceRange} onChange={(e, newValue) => setPriceRange(newValue)} valueLabelDisplay="auto" min={0} max={10000000} step={10000} valueLabelFormat={(value) => `${value.toLocaleString()}원`} />
                  </Box>
                  <div className="price-input-group">
                     <input type="text" value={priceRange[0].toLocaleString()} onChange={(e) => handlePriceInputChange(0, e.target.value)} />
                     <span>-</span>
                     <input type="text" value={priceRange[1].toLocaleString()} onChange={(e) => handlePriceInputChange(1, e.target.value)} />
                  </div>
               </div>
            </aside>
            <main className="search-results-section">
               <h1 className="results-title">
                  {searchTerm ? `'${searchTerm}'에 대한 검색 결과` : '전체 상품'}
                  <span className="results-count">({results?.totalItems || 0}개)</span>
               </h1>
            </main>
         </div>
      </>
   )
}

export default SearchPage
