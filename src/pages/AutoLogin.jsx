import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './LoginPage'

const AuthContext = createContext(null)

const API_BASE_URL = 'http://localhost:8080/api'

export default function App() {
   const [user, setUser] = useState(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const autoLogin = async () => {
         const refreshToken = localStorage.getItem('refreshToken')
         if (!refreshToken) {
            setIsLoading(false)
            return
         }

         try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ refreshToken }),
            })

            if (res.ok) {
               const { accessToken } = await res.json()
               sessionStorage.setItem('accessToken', accessToken)
               setUser({ loggedIn: true })
            } else {
               localStorage.removeItem('refreshToken')
            }
         } catch (error) {
            console.error('자동 로그인 실패:', error)
         } finally {
            setIsLoading(false)
         }
      }

      autoLogin()
   }, [])

   const login = (userData, refreshToken) => {
      setUser(userData)
      if (refreshToken) {
         localStorage.setItem('refreshToken', refreshToken)
      }
   }

   const logout = () => {
      const refreshToken = localStorage.getItem('refreshToken')
      fetch(`${API_BASE_URL}/auth/logout`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ refreshToken }),
      })

      setUser(null)
      localStorage.removeItem('refreshToken')
      sessionStorage.removeItem('accessToken')
   }

   if (isLoading) {
      return <div>로딩 중...</div>
   }

   return (
      <AuthContext.Provider value={{ user, login, logout }}>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={user ? <MainPage /> : <LoginPage />} />
            </Routes>
         </BrowserRouter>
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
   return useContext(AuthContext)
}

function MainPage() {
   const { logout } = useAuth()
   return (
      <div>
         <h1>메인 페이지</h1>
         <p>로그인에 성공했습니다!</p>
         <button onClick={logout}>로그아웃</button>
      </div>
   )
}
