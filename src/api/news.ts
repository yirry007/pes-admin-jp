import request from '@/utils/request'
import { ResultData, News } from '@/types/api'
export default {
  // 获取新闻列表
  getNewsList(params: News.Params) {
    return request.get<ResultData<News.NewsItem>>('/admin/news', params)
  },
  // 创建新闻
  createNews(params: News.CreateParams) {
    return request.post('/admin/news', params)
  },
  // 编辑新闻
  editNews(params: News.EditParams) {
    return request.put('/admin/news/' + params.id, params)
  },
  // 删除新闻
  delNews(params: { id: number }) {
    return request.delete('/admin/news/' + params.id)
  },
}
