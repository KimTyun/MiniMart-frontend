import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import '../../styles/searchbar.css'

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState('')
   const navigate = useNavigate()

   const handleSearch = () => {
      navigate(`/search?keyword=${searchTerm}`)
   }

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSearch()
      }
   }

   return (
      <div className="searchbar-wrapper">
         <div className="searchbar-container">
            <div className="searchbar-search-box">
               <input type="text" placeholder="검색어를 입력해주세요." className="searchbar-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} />
               <SearchIcon className="searchbar-search-icon" onClick={handleSearch} />
            </div>
         </div>
      </div>
   )
}

export default SearchBar
