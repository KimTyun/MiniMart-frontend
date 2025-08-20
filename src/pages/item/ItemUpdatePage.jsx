import React, { useEffect, useMemo } from 'react'
import IteamCreateForm from '../../components/item/IteamCreateForm'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { checkAuthStatusThunk } from '../../features/authSlice'
import { getItemThunk } from '../../features/itemSlice'

function ItemCreatePage() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { item } = useSelector((s) => s.item)
   const { id } = useParams()
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
         .unwrap()
         .then((result) => {
            if (!result.isAuthenticated || result.user.role !== 'SELLER') {
               alert('허가되지 않은 접근입니다.')
               navigate('/')
            }
            dispatch(getItemThunk(id))
         })
   }, [dispatch, id, navigate])
   const prevData = useMemo(() => {
      if (!item) return
      const formData = { name: item.name, status: item.status, stock_number: item.stock_number, price: item.price, description: item.description, is_sale: item.is_sale, sale: item.sale }
      const imgs = item.ItemImgs.filter((e) => !(e.rep_img_yn || e.details_img_yn)).map((e) => `${import.meta.env.VITE_API_URL}${e.img_url}`)
      const repImg = `${import.meta.env.VITE_API_URL}${item.ItemImgs.find((e) => e.rep_img_yn).img_url}`
      const detailsImg = `${import.meta.env.VITE_API_URL}${item.ItemImgs.find((e) => e.details_img_yn).img_url}`
      const options = item.ItemOptions.map((e) => ({ id: e.id, name: e.name, price: e.price }))
      return { formData, imgs, repImg, detailsImg, options }
   }, [item])
   return <>{item && <IteamCreateForm prevData={prevData} />}</>
}

export default ItemCreatePage
