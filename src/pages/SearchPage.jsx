import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { searchItemsThunk } from '../features/searchSlice'

import Slider from '@mui/material/Slider'
import Box from '@mui/material/Box'
import '../styles/SearchPage.css'
import SearchBar from '../components/shared/SearchBar'

const SearchPage = () => {
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()

   const { results, loading, error } = useSelector((state) => state.search)

   const params = new URLSearchParams(location.search)
   const [searchTerm, setSearchTerm] = useState(params.get('keyword') || '')
   const [priceRange, setPriceRange] = useState([parseInt(params.get('minPrice'), 10) || 0, parseInt(params.get('maxPrice'), 10) || 10000000])

   useEffect(() => {
      const keyword = params.get('keyword') || ''
      const minPrice = parseInt(params.get('minPrice'), 10) || 0
      const maxPrice = parseInt(params.get('maxPrice'), 10) || 10000000
      setSearchTerm(keyword)
      setPriceRange([minPrice, maxPrice])

      dispatch(searchItemsThunk({ keyword, minPrice, maxPrice }))
   }, [location.search, dispatch])

   const updateURL = useCallback(() => {
      const newParams = new URLSearchParams()
      if (searchTerm) newParams.set('keyword', searchTerm)
      if (priceRange[0] > 0) newParams.set('minPrice', priceRange[0])
      if (priceRange[1] < 10000000) newParams.set('maxPrice', priceRange[1])

      navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })
   }, [searchTerm, priceRange, navigate, location.pathname])

   const handlePriceInputChange = (index, value) => {
      const newPriceRange = [...priceRange]
      const numericValue = parseInt(value.replace(/,/g, ''), 10) || 0

      if (index === 0 && numericValue > newPriceRange[1]) {
         newPriceRange[index] = newPriceRange[1]
      } else if (index === 1 && numericValue < newPriceRange[0]) {
         newPriceRange[index] = newPriceRange[0]
      } else {
         newPriceRange[index] = numericValue
      }

      setPriceRange(newPriceRange)
   }

   const renderResults = () => {
      if (loading) return <div className="loading-text">상품을 찾고 있습니다...</div>
      if (error)
         return (
            <div className="error-message">
               <p>{error}</p>
            </div>
         )
      if (!results || !Array.isArray(results.items) || results.items.length === 0) {
         return (
            <div className="no-results">
               <h2>검색 결과가 없습니다</h2>
            </div>
         )
      }
      return (
         <div className="results-grid">
            {results.items.map((item) => (
               <Link to={`/item/${item.id}`} key={item.id} className="product-card">
                  <img src={item.ItemImgs?.[0]?.img_url ? `${import.meta.env.VITE_API_URL}${item.ItemImgs[0].img_url}` : '/placeholder.png'} alt={item.name} className="product-image" />
                  <div className="product-info">
                     <h3 className="product-name">{item.name || '이름 없는 상품'}</h3>
                     <div className="product-price">{typeof item.price === 'number' ? `${item.price.toLocaleString()}원` : '가격 문의'}</div>
                  </div>
               </Link>
            ))}
         </div>
      )
   }

   return (
      <>
         <SearchBar />
         <div className="search-page-container">
            <aside className="search-filter-section">
               <div className="filter-box">
                  <h3 className="filter-title">검색어</h3>
                  <input
                     type="text"
                     className="search-term-input"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     onKeyPress={(e) => {
                        if (e.key === 'Enter') updateURL()
                     }}
                  />
                  <h3 className="filter-title" style={{ marginTop: '2rem' }}>
                     가격 설정
                  </h3>
                  <Box sx={{ padding: '0 10px' }}>
                     <Slider value={priceRange} onChange={(e, newValue) => setPriceRange(newValue)} onChangeCommitted={updateURL} valueLabelDisplay="auto" min={0} max={10000000} step={10000} />
                  </Box>
                  <div className="price-input-group">
                     <input type="text" value={priceRange[0].toLocaleString()} onChange={(e) => handlePriceInputChange(0, e.target.value)} onBlur={updateURL} />
                     <span>-</span>
                     <input type="text" value={priceRange[1].toLocaleString()} onChange={(e) => handlePriceInputChange(1, e.target.value)} onBlur={updateURL} />
                  </div>
               </div>
            </aside>
            <main className="search-results-section">
               <h1 className="results-title">
                  {params.get('keyword') ? `'${params.get('keyword')}'에 대한 검색 결과` : '전체 상품'}
                  <span className="results-count">({results?.totalItems || 0}개)</span>
               </h1>
               {renderResults()}
            </main>
         </div>
      </>
   )
}

export default SearchPage
