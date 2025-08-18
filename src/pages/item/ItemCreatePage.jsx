import React, { useEffect } from 'react'
import IteamCreateForm from '../../components/item/IteamCreateForm'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkAuthStatusThunk } from '../../features/authSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
         .unwrap()
         .then((result) => {
            if (!result.isAuthenticated || result.user.role !== 'SELLER') {
               alert('허가되지 않은 접근입니다.')
               navigate('/')
            }
         })
   }, [])
   return (
      <>
         <IteamCreateForm />
      </>
   )
}

export default ItemCreatePage
