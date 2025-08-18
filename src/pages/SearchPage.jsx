import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, Link } from 'react-router-dom'
import minimartApi from '../api/axiosApi'

import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import '../styles/SearchPage.css'

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
   const initialSearchTerm = location.state?.searchTerm || new URLSearchParams(location.search).get('keyword') || ''
   const initialResults = location.state?.results || { items: [], totalItems: 0 }

   const [results, setResults] = useState(initialResults)
   const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
   const [priceRange, setPriceRange] = useState([0, 500000])
   const [isLoading, setIsLoading] = useState(true)

   const runSearch = useCallback(async (currentSearchTerm, currentPrice) => {
      if (!currentSearchTerm) {
         setIsLoading(false)
         setResults({ items: [], totalItems: 0 })
         return
      }
      setIsLoading(true)
      const params = {
         keyword: currentSearchTerm,
         minPrice: currentPrice[0],
         maxPrice: currentPrice[1],
      }
      const searchResult = await searchItemsAPI(params)
      setResults(searchResult || { items: [], totalItems: 0 })
      setIsLoading(false)
   }, [])

   useEffect(() => {
      const handler = setTimeout(() => {
         runSearch(searchTerm, priceRange)
      }, 500)
      return () => clearTimeout(handler)
   }, [searchTerm, priceRange, runSearch])

   const handleSliderChange = (event, newValue) => {
      setPriceRange(newValue)
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
            {results.items.map((item) => (
               <Link to={`/item/${item.id}`} key={item.id} className="product-card">
                  <img src={item.ItemImgs && item.ItemImgs.length > 0 ? `${import.meta.env.VITE_API_URL}${item.ItemImgs[0].img_url}` : '/placeholder.png'} alt={item.name} className="product-image" />
                  <div className="product-info">
                     <p className="product-seller">{item.Seller?.name}</p>
                     <h3 className="product-name">{item.name}</h3>
                     <div className="product-price">{item.price.toLocaleString()}원</div>
                  </div>
               </Link>
            ))}
         </div>
      )
   }

   return (
      <div className="search-page-container">
         <aside className="search-filter-section">
            <div className="filter-box">
               <h3 className="filter-title">검색어</h3>
               <p className="highlight">{searchTerm || '...'}</p>

               <h3 className="filter-title" style={{ marginTop: '2rem' }}>
                  가격 설정
               </h3>
               <Box sx={{ padding: '0 10px' }}>
                  <Slider value={priceRange} onChange={handleSliderChange} valueLabelDisplay="auto" min={0} max={500000} step={10000} valueLabelFormat={(value) => `${value.toLocaleString()}원`} />
               </Box>
               <div className="price-range-display">
                  <span>{priceRange[0].toLocaleString()}원</span>
                  <span>-</span>
                  <span>{priceRange[1].toLocaleString()}원</span>
               </div>
            </div>
         </aside>

         <main className="search-results-section">
            <h1 className="results-title">
               검색 결과 <span className="results-count">({results?.totalItems || 0}개)</span>
            </h1>
            {renderResults()}
         </main>
      </div>
   )
}

export default SearchPage
