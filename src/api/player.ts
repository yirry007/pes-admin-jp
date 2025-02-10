import request from '@/utils/request'
import { Player, ResultData } from '@/types/api'
export default {
  // 获取球员列表
  getPlayerList(params: Player.Params) {
    return request.get<ResultData<Player.PlayerItem>>('/admin/player', params)
  },
}
