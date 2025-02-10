import request from '@/utils/request'
import { ResultData, User } from '@/types/api'
export default {
  // 获取用户列表
  getUserList(params: User.Params) {
    return request.get<ResultData<User.UserItem>>('/admin/user', params)
  },
  // 创建用户
  createUser(params: User.CreateParams) {
    return request.post('/admin/user', params)
  },
  // 编辑用户
  editUser(params: User.EditParams) {
    return request.put('/admin/user/' + params.id, params)
  },
  // 删除用户
  delUser(params: { id: number }) {
    return request.delete('/admin/user/' + params.id)
  },
  // 获取所有用户
  getAllUsers() {
    return request.get<any>('/admin/all_users')
  },
}
