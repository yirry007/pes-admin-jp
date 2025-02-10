import { routerMenu } from '@/router'
import { findTreeNode } from '@/utils'
import { Breadcrumb } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function BreadCrumb() {
  const { pathname } = useLocation()
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])
  // 权限判断
  const menus: any = routerMenu

  useEffect(() => {
    const list = findTreeNode(menus, pathname, [])
    setBreadList([<a href='/#/schedule'>ホーム</a>, ...list])
  }, [pathname])
  return <Breadcrumb items={breadList.map(item => ({ title: item }))} style={{ marginLeft: 10 }} />
}
