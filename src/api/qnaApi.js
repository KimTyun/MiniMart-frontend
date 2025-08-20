import minimartApi from './axiosApi'

// 문의 작성 API
export const createQna = async (formData) => {
   const res = await minimartApi.post('/api/qna', formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   })
   return res.data
}
