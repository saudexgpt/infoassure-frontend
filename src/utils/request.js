import axios from 'axios'
import { getToken, setToken } from '@/utils/auth'
// Create axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_MIX_BASE_API,
  timeout: 300000, // Request timeout
})

// Request intercepter
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${getToken()}` // Set JWT token
    }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  },
)

// response pre-processing
service.interceptors.response.use(
  response => {
    if (response.headers.authorization) {
      setToken(response.headers.authorization)
      // eslint-disable-next-line no-param-reassign
      response.data.token = response.headers.authorization
    }

    return response.data
  },
  error =>
    // const message = error.message
    // if (error.response.data && error.response.data.errors) {
    //   message = error.response.data.errors
    // } else if (error.response.data && error.response.data.error) {
    //   message = error.response.data.error
    // }
    // eslint-disable-next-line implicit-arrow-linebreak
    Promise.reject(error),
)

export default service
