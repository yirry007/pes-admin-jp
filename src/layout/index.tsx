import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import Menu from '@/components/Menu'
import styles from './index.module.less'
import { useStore } from '@/store'
import TabsFC from '@/components/Tabs'
const { Sider } = Layout

const App: React.FC = () => {
  const { collapsed } = useStore()

  return (
    <Layout>
      <Sider collapsed={collapsed}>
        <Menu />
      </Sider>
      <Layout>
        <NavHeader />
        <TabsFC />
        <div className={styles.content}>
          <div className={styles.wrapper}>
            <Outlet></Outlet>
          </div>
          <NavFooter />
        </div>
      </Layout>
    </Layout>
  )
}

export default App
