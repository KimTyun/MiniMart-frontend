/*
import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { searchItemsThunk } from '../features/searchSlice'
// ... 다른 import들 ...

const SearchPage = () => {
   const dispatch = useDispatch()
   const location = useLocation()
   const navigate = useNavigate()

   const { results, loading, error } = useSelector((state) => state.search)

   const params = new URLSearchParams(location.search)
   const [searchTerm, setSearchTerm] = useState(params.get('keyword') || '')
   const [priceRange, setPriceRange] = useState([parseInt(params.get('minPrice'), 10) || 0, parseInt(params.get('maxPrice'), 10) || 10000000])

   // ✅ useEffect 의존성 배열에 'params'를 추가합니다.
   useEffect(() => {
      const keyword = params.get('keyword') || ''
      const minPrice = params.get('minPrice') || 0
      const maxPrice = params.get('maxPrice') || 10000000

      setSearchTerm(keyword)
      setPriceRange([parseInt(minPrice, 10), parseInt(maxPrice, 10)])

      dispatch(searchItemsThunk({ keyword, minPrice, maxPrice }))
   }, [location.search, dispatch, params]) // ✅ 여기에 params 추가

   // ... (이하 코드는 동일)

   // updateURL 함수는 더 이상 사용되지 않으므로 삭제해도 좋습니다.
   // const updateURL = () => { ... }

   // 가격 직접 입력 핸들러도 더 이상 필요 없습니다.
   // const handlePriceInputChange = (...) => { ... }

   // SearchBar가 URL을 직접 변경하고, 위 useEffect가 그 변경을 감지하여
   // 검색을 실행하는 방식으로 로직이 단순화되었습니다.

   // ...
}

export default SearchPage
*/
