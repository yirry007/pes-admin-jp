import { News } from '@/types/api'
import { Button, Table, Form, Input, Space, Tag, Image, Empty, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import api from '@/api/news'
import NewsForm from './NewsForm'
import { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks'
import SearchForm from '@/components/SearchForm'
import { modal } from '@/utils/AntdGlobal'
export default function NewsList() {
  const [form] = Form.useForm()
  const newsRef = useRef<{
    open: (type: IAction, data?: News.NewsItem) => void
  }>()

  const { Link } = Typography;

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: News.SearchParams) => {
    return api
      .getNewsList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(res => {
        return {
          total: res.page.total,
          list: res.list
        }
      })
  }

  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 10
  })

  // 创建新闻
  const handleCreate = () => {
    newsRef.current?.open('create')
  }

  // 编辑新闻
  const handleEdit = (record: News.NewsItem) => {
    newsRef.current?.open('edit', record)
  }

  // 删除新闻
  const handleDel = (id: number) => {
    modal.confirm({
      title: '削除確認',
      content: <span>このニュースを削除してもよろしいですか？</span>,
      okText: '確認する',
      cancelText: '中止する',
      onOk: async () => {
        try {
          await api.delNews({
            id
          })
          search.reset()
        } catch (error) {}
      }
    })
  }

  const columns: ColumnsType<News.NewsItem> = [
    {
      title: '横幅にする',
      dataIndex: 'is_banner',
      key: 'is_banner',
      width: 60,
      render(record: number) {
        return record === 1 ? <Tag color="orange">横幅</Tag> : <Tag>一般</Tag>
      }
    },
    {
      title: 'タイトル',
      dataIndex: 'title',
      key: 'title',
      width: 180
    },
    {
      title: '概要',
      dataIndex: 'subject',
      key: 'subject',
      width: 240
    },
    {
      title: '画像',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render(record: string) {
        return record ? <Image width={100} src={record} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    },
    {
      title: 'リンクURL',
      dataIndex: 'url',
      key: 'url',
      width: 160,
      render(record: string) {
        return (
          <Link href={record} target="_blank">{record}</Link>
        )
      }
    },
    {
      title: 'ソート',
      dataIndex: 'sort',
      key: 'sort',
      width: 40
    },
    {
      title: '使用する',
      dataIndex: 'is_use',
      key: 'is_use',
      width: 60,
      render(record: number) {
        return record === 1 ? <Tag color="success">使用する</Tag> : <Tag color="error">使用禁止</Tag>
      }
    },
    {
      title: '作成時間',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 100
    },
    {
      title: '操作',
      key: 'operations',
      width: 120,
      render(record: News.NewsItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              編集
            </Button>
            <Button type='text' danger onClick={() => handleDel(record.id)}>
              削除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div>
      <SearchForm form={form} initialValues={{ state: 1 }} submit={search.submit} reset={search.reset}>
        <Form.Item name='title' label='タイトル'>
          <Input placeholder='タイトルを入力してください。' />
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>ニュース一覧</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              追加
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='id'
          columns={columns}
          {...tableProps}
        />
      </div>
      <NewsForm
        mRef={newsRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}
