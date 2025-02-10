import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import styles from './index.module.less'
import api from '@/api/login'
import { Login } from '@/types/api'
import storage from '@/utils/storage'
import { useStore } from '@/store'
export default function LoginFC() {
  const [loading, setLoading] = useState(false)
  const updateToken = useStore(state => state.updateToken)
  const onFinish = async (values: Login.params) => {
    try {
      setLoading(true)
      const result = await api.login(values)
      setLoading(false)
      storage.set('token', result)
      updateToken(result)
      message.success('登录成功')
      setTimeout(() => {
        location.href = '/admins/#/schedule'
      })
    } catch (error) {
      setLoading(false)
      message.error('登录失败')
    }
  }
  return (
    <div className={styles.login}>
      <div className={styles.loginWrapper}>
        <div className={styles.title}>宇联eスポーツ</div>
        <Form name='basic' initialValues={{ remember: true }} onFinish={onFinish} autoComplete='off'>
          <Form.Item name='username' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' block htmlType='submit' loading={loading}>
              ログイン
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
