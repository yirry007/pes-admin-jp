import axios, { AxiosError } from 'axios'
import { showLoading, hideLoading } from './loading'
import storage from './storage'
import env from '@/config'
import { Result } from '@/types/api'
import { message } from './AntdGlobal'

// 创建实例
const instance = axios.create({
  timeout: 30000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    if (config.showLoading)
      showLoading()
    const token = storage.get('token')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token.access_token
    }
    if (env.mock) {
      config.baseURL = env.mockApi
    } else {
      config.baseURL = env.baseApi
    }
    return {
      ...config
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const data: Result = response.data
    hideLoading()
    if (response.config.responseType === 'blob') return response

    if (data.code === 'E0000') {
      message.error(data.message)
      storage.remove('token')
      location.href = '/admins/#/login'
      return
    }

    if (data.code != '') {
      if (response.config.showError) {
        message.error(data.message)
      }
      return Promise.reject(data)
    }

    if (!data.result) {
      message.success(data.message)
    }

    return data.result
  },
  error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  }
)

interface IConfig {
  showLoading?: boolean
  showError?: boolean
}
export default {
  get<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.get(url, { params, ...options })
  },
  post<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.post(url, params, options)
  },
  put<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.put(url, params, options)
  },
  delete<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.delete(url, { params, ...options })
  }
}
