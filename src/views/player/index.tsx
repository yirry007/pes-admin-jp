import {  Player } from '@/types/api'
import { Button, Table, Form, Input, Space, Avatar, InputNumber } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import api from '@/api/player'
import { useAntdTable } from 'ahooks'
import SearchForm from '@/components/SearchForm'
import { UserOutlined } from '@ant-design/icons'
import { useRef } from 'react'
import { IAction } from '@/types/modal'
import Detail from './Detail'
export default function PlayerList() {
  const [form] = Form.useForm()
  const playerRef = useRef<{
    open: (type: IAction, data?: Player.PlayerItem) => void
  }>()

  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Player.SearchParams) => {
    return api
      .getPlayerList({
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

  // 查看详细
  const handleDetail = (record: Player.PlayerItem) => {
    const data = JSON.parse(record.data);
    playerRef.current?.open('detail', {...record, data})
  }

  const columns: ColumnsType<Player.PlayerItem> = [
    {
      title: '画像',
      dataIndex: 'image_url',
      key: 'image_url',
      width: 50,
      render(record: string) {
        return record ? <Avatar shape="square" size={48} src={record} /> : <Avatar shape="square" size={48} icon={<UserOutlined />} />
      }
    },
    {
      title: '氏名',
      dataIndex: 'name_en',
      key: 'name_en',
      width: 100
    },
    {
      title: '国籍',
      dataIndex: 'nation_abbr',
      key: 'nation_abbr',
      width: 60,
      render(value, record) {
        return (
            <>
                <div>
                    <img width={30} src={record.nation_image} alt="" />
                </div>
                <div>{value}</div>
            </>
        )
      }
    },
    {
      title: '年齢',
      dataIndex: 'age',
      key: 'age',
      width: 60
    },
    {
        title: '身長cm',
        dataIndex: 'height',
        key: 'height',
        width: 70
    },
    {
        title: '体重kg',
        dataIndex: 'weight',
        key: 'weight',
        width: 70
    },
    {
        title: 'ポジション',
        dataIndex: 'position',
        key: 'position',
        width: 70
    },
    {
        title: '利き足',
        dataIndex: 'strong_foot',
        key: 'strong_foot',
        width: 80
    },
    {
        title: '点数',
        dataIndex: 'rating',
        key: 'rating',
        width: 70
    },
    {
      title: '操作',
      key: 'operations',
      width: 80,
      render(record: Player.PlayerItem) {
        return (
          <Space>
            <Button type='text' onClick={() => handleDetail(record)}>
            詳細
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div>
      <SearchForm form={form} initialValues={{ state: 1 }} submit={search.submit} reset={search.reset}>
        <Form.Item name='name' label='姓名'>
          <Input placeholder='氏名を入力してください。' />
        </Form.Item>
        <Form.Item name='nation' label='国籍'>
          <Input placeholder='国籍を入力してください。' />
        </Form.Item>
        <Form.Item name='position' label='ポジション'>
          <Input placeholder='ポジションを入力してください。' />
        </Form.Item>
        <Form.Item name='rating_start' label='点数'>
          <InputNumber placeholder='点数を入力してください。（低）' />
        </Form.Item>
        <Form.Item name='rating_end' label='评分范围'>
          <InputNumber placeholder='点数を入力してください。(高)' />
        </Form.Item>
      </SearchForm>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>選手一覧</div>
        </div>
        <Table
          bordered
          rowKey='code'
          columns={columns}
          {...tableProps}
        />
      </div>
      <Detail
        mRef={playerRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}
