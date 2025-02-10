import request from '@/utils/request'
export default {
  // 获取赛事日程
  getSchedule(params: {year: any, month: any}) {
    return request.get('/admin/schedule', params)
  },
}
