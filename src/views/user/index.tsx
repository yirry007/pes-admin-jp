import {  User } from '@/types/api'
import { Button, Table, Form, Input, Space, Avatar } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import api from '@/api/user'
import UserForm from './UserForm'
import { IAction } from '@/types/modal'
import { useAntdTable } from 'ahooks'
import SearchForm from '@/components/SearchForm'
import { UserOutlined } from '@ant-design/icons'
import { modal } from '@/utils/AntdGlobal'
export default function UserList() {
  const [form] = Form.useForm()
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void
  }>()

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: User.SearchParams) => {
    return api
      .getUserList({
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

  // 创建用户
  const handleCreate = () => {
    userRef.current?.open('create')
  }

  // 编辑用户
  const handleEdit = (record: User.UserItem) => {
    const tags = JSON.parse(record.tags);
    userRef.current?.open('edit', {...record, tags})
  }

  // 删除用户
  const handleDel = (id: number) => {
    modal.confirm({
      title: '削除確認',
      content: <span>このユーザーを削除してもよろしいですか？</span>,
      okText: '確認する',
      cancelText: '中止する',
      onOk: async () => {
        try {
          await api.delUser({
            id
          })
          search.reset()
        } catch (error) {}
      }
    })
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '画像',
      dataIndex: 'head_image_url',
      key: 'head_image_url',
      width: 160,
      render(record: string) {
        return record ? <Avatar shape="square" size={48} src={record} /> : <Avatar shape="square" size={48} icon={<UserOutlined />} />
      }
    },
    {
      title: '電話番号',
      dataIndex: 'phone',
      key: 'phone',
      width: 240
    },
    {
      title: '名前',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 300
    },
    {
      title: 'ラベル',
      dataIndex: 'tags',
      key: 'tags',
      render(record: string) {
        let tags: string[];
        try {
          tags = JSON.parse(record);
        } catch (e) {
          console.log(e)
          tags = [];
        }

        return tags.join(' / ');
      }
    },
    {
      title: '操作',
      key: 'operations',
      width: 120,
      render(record: User.UserItem) {
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
        <Form.Item name='phone' label='電話番号'>
          <Input placeholder='電話番号を入力してください。' />
        </Form.Item>
        <Form.Item name='nickname' label='名前'>
          <Input placeholder='名前を入力してください。' />
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>ユーザー一覧</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              追加
            </Button>
          </div>
        </div>
        <Table
          bordered
          rowKey='phone'
          columns={columns}
          {...tableProps}
        />
      </div>
      <UserForm
        mRef={userRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}
