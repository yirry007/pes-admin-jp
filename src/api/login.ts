import request from '@/utils/request'
import { Login } from '@/types/api'
export default {
  // 登录
  login(params: Login.params) {
    return request.post<string>('/admin/login', params, { showLoading: false })
  },
}
