import axios from 'axios'

// 리뷰 등록 API
export const createReviewApi = async (formData) => {
   const res = await axios.post('/api/reviews', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   })
   return res.data
}
