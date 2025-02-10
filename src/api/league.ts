import request from '@/utils/request'
import { ResultData, League } from '@/types/api'
export default {
  // 获取联赛列表
  getLeagueList(params: League.Params) {
    return request.get<ResultData<League.LeagueItem>>('/admin/league', params)
  },
  // 创建联赛
  createLeague(params: League.CreateParams) {
    return request.post('/admin/league', params)
  },
  // 编辑联赛
  editLeague(params: League.EditParams) {
    return request.put('/admin/league/' + params.id, params)
  },
  // 删除联赛
  delLeague(params: { id: number }) {
    return request.delete('/admin/league/' + params.id)
  },
  // 获取参赛用户列表
  getLeagueUsers(params: { id: number }) {
    return request.get<any>('/admin/league_users/' + params.id)
  },
  // 设置参赛用户，生成比赛
  updateLeagueData(params: {id: any, users: any, create_game?: boolean}) {
    return request.post('/admin/update_league_data/' + params.id, params)
  },
  // 获取赛程数据
  getLeagueGames(params?: { name: string }) {
    return request.get<any>('/admin/league_games', params)
  },
  // 更新比赛数据
  updateLeagueGame(params: {id: number, home_goal?: any, away_goal?: any, game_time?: any, status?: any}) {
    return request.post('/admin/update_league_game/' + params.id, params)
  },
  // 获取联赛排名
  getLeagueRanking(params?: { name: string }) {
    return request.get<any>('/admin/league_ranking', params)
  },
}
