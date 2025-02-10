import {  League } from '@/types/api'
import { Button, Table, Form, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import userApi from '@/api/user'
import leagueApi from '@/api/league'
import LeagueForm from './LeagueForm'
import { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks'
import SearchForm from '@/components/SearchForm'
import { modal } from '@/utils/AntdGlobal'
import LeagueUser from './LeagueUser'
export default function LeagueList() {
  const [form] = Form.useForm()
  const leagueRef = useRef<{
    open: (type: IAction, data?: League.LeagueItem) => void
  }>()
  const leagueUserRef = useRef<{
    open: (data?: any) => void
  }>()

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: League.SearchParams) => {
    return leagueApi
      .getLeagueList({
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

  // 创建联赛
  const handleCreate = () => {
    leagueRef.current?.open('create')
  }

  // 编辑联赛
  const handleEdit = (record: League.LeagueItem) => {
    leagueRef.current?.open('edit', record)
  }

  // 设置参赛用户
  const handleLeagueUser = async (record: League.LeagueItem) => {
    const _allUsers = await userApi.getAllUsers();
    const _leagueUsers = await leagueApi.getLeagueUsers({id: record.id});

    leagueUserRef.current?.open({
      league: record,
      all_users: _allUsers,
      league_users: _leagueUsers,
    });
  }
  
  // 删除联赛
  const handleDel = (id: number) => {
    modal.confirm({
      title: '削除確認',
      content: <span>このリーグを削除してもよろしいですか？</span>,
      okText: '確認する',
      cancelText: '中止する',
      onOk: async () => {
        try {
          await leagueApi.delLeague({
            id
          })
          search.reset()
        } catch (error) {}
      }
    })
  }

  const columns: ColumnsType<League.LeagueItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40
    },
    {
      title: 'リーグ名',
      dataIndex: 'name',
      key: 'name',
      width: 160
    },
    {
      title: '参加人数',
      dataIndex: 'user_number',
      key: 'user_number',
      width: 100
    },
    {
      title: 'リーグ形式',
      dataIndex: 'game_mode',
      key: 'game_mode',
      width: 160,
      render(record: number) {
        return record === 1 ? '一回' : 'ホーム・アウェイ'
      }
    },
    {
      title: '開始日',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 160
    },
    {
      title: '終了日',
      dataIndex: 'end_date',
      key: 'end_date',
      width: 160
    },
    {
      title: '備考',
      dataIndex: 'memo',
      key: 'memo',
      width: 240
    },
    {
      title: '操作',
      key: 'operations',
      width: 150,
      render(record: League.LeagueItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleLeagueUser(record)}>
              参加ユーザー
            </Button>
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
        <Form.Item name='name' label='リーグ名'>
          <Input placeholder='リーグ名を入力してください。' />
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>リーグ一覧</div>
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
      <LeagueForm
        mRef={leagueRef}
        update={() => {
          search.reset()
        }}
      />
      <LeagueUser mRef={leagueUserRef} />
    </div>
  )
}
