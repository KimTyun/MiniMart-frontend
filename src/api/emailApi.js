import minimartApi from './axiosApi'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const sendCodeByEmail = (email) => {
   return minimartApi.post(`${API_BASE_URL}/send-code`, { email })
}

export const verifyCodeByEmail = (email, code) => {
   return minimartApi.post(`${API_BASE_URL}/verify-code`, { email, code })
}

export const resetPasswordByEmail = (email, newPassword) => {
   return minimartApi.post(`${API_BASE_URL}/reset-password`, {
      email,
      newPassword,
   })
}
