import {  Cup } from '@/types/api'
import { Button, Table, Form, Input, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import userApi from '@/api/user'
import cupApi from '@/api/cup'
import CupForm from './CupForm'
import { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks'
import SearchForm from '@/components/SearchForm'
import { modal } from '@/utils/AntdGlobal'
import CupUser from './CupUser'
export default function CupList() {
  const [form] = Form.useForm()
  const cupRef = useRef<{
    open: (type: IAction, data?: Cup.CupItem) => void
  }>()
  const cupUserRef = useRef<{
    open: (data?: any) => void
  }>()

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Cup.SearchParams) => {
    return cupApi
      .getCupList({
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

  // 创建杯赛
  const handleCreate = () => {
    cupRef.current?.open('create')
  }

  // 编辑杯赛
  const handleEdit = (record: Cup.CupItem) => {
    cupRef.current?.open('edit', record)
  }

  // 设置参赛用户
  const handleCupUser = async (record: Cup.CupItem) => {
    const _allUsers = await userApi.getAllUsers();
    const _cupUsers = await cupApi.getCupUsers({id: record.id});

    cupUserRef.current?.open({
      cup: record,
      all_users: _allUsers,
      cup_users: _cupUsers,
    });
  }
  
  // 删除杯赛
  const handleDel = (id: number) => {
    modal.confirm({
      title: '削除確認',
      content: <span>このカップ戦を削除してもよろしいですか？</span>,
      okText: '確認する',
      cancelText: '中止する',
      onOk: async () => {
        try {
          await cupApi.delCup({
            id
          })
          search.reset()
        } catch (error) {}
      }
    })
  }

  const columns: ColumnsType<Cup.CupItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40
    },
    {
      title: 'カップ戦名',
      dataIndex: 'name',
      key: 'name',
      width: 180
    },
    {
      title: '参加人数',
      dataIndex: 'user_number',
      key: 'user_number',
      width: 120
    },
    {
      title: '開始日',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 180
    },
    {
      title: '終了日',
      dataIndex: 'end_date',
      key: 'end_date',
      width: 180
    },
    {
      title: '備考',
      dataIndex: 'memo',
      key: 'memo',
      width: 270
    },
    {
      title: '操作',
      key: 'operations',
      width: 150,
      render(record: Cup.CupItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleCupUser(record)}>
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
        <Form.Item name='name' label='カップ戦名'>
          <Input placeholder='カップ戦名を入力してください。' />
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>カップ戦一覧</div>
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
      <CupForm
        mRef={cupRef}
        update={() => {
          search.reset()
        }}
      />
      <CupUser mRef={cupUserRef} />
    </div>
  )
}
