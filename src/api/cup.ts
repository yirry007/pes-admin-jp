import request from '@/utils/request'
import { ResultData, Cup } from '@/types/api'
export default {
  // 获取杯赛列表
  getCupList(params: Cup.Params) {
    return request.get<ResultData<Cup.CupItem>>('/admin/cup', params)
  },
  // 创建杯赛
  createCup(params: Cup.CreateParams) {
    return request.post('/admin/cup', params)
  },
  // 编辑杯赛
  editCup(params: Cup.EditParams) {
    return request.put('/admin/cup/' + params.id, params)
  },
  // 删除杯赛
  delCup(params: { id: number }) {
    return request.delete('/admin/cup/' + params.id)
  },
  // 获取参赛用户列表
  getCupUsers(params: { id: number }) {
    return request.get<any>('/admin/cup_users/' + params.id)
  },
  // 设置参赛用户，生成比赛
  updateCupData(params: {id: any, users: any, create_game?: boolean}) {
    return request.post('/admin/update_cup_data/' + params.id, params)
  },
  // 获取赛程数据
  getCupGames(params?: { name: string }) {
    return request.get<any>('/admin/cup_games', params)
  },
  // 更新比赛数据
  updateCupGame(params: {id: number, home_goal?: any, away_goal?: any, home_goal_penalty?: any, away_goal_penalty?: any, game_time?: any, status?: any}) {
    return request.post('/admin/update_cup_game/' + params.id, params)
  },
  // 获取杯赛排名
  getCupRanking(params?: { name: string }) {
    return request.get<any>('/admin/cup_ranking', params)
  },
}
