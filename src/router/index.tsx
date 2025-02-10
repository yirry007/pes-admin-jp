import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '@/views/login/Login'
import Error403 from '@/views/403'
import Error404 from '@/views/404'
import Layout from '@/layout'
import { lazyLoad } from './LazyLoad'
import { getRouterInfo } from '@/utils'

export const routerMenu = [
  {
    menuType: 1,
    menuName: "試合日程",
    path: '/schedule',
    icon: 'ScheduleOutlined',
    element: lazyLoad(React.lazy(() => import('@/views/schedule')))
  },
  {
    menuType: 1,
    menuName: "ユーザー管理",
    path: '/users',
    icon: "UserOutlined",
    element: lazyLoad(React.lazy(() => import('@/views/user')))
  },
  {
    menuType: 1,
    menuName: "選手資料",
    path: '/players',
    icon: "SolutionOutlined",
    element: lazyLoad(React.lazy(() => import('@/views/player')))
  },
  {
    menuType: 1,
    menuName: "リーグ管理",
    path: '',
    icon: "CrownOutlined",
    children: [
      {
        menuType: 1,
        menuName: "一覧",
        path: '/leagues',
        icon: "ProfileOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/league')))
      },
      {
        menuType: 1,
        menuName: "日程",
        path: '/league_game',
        icon: "CalendarOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/league/LeagueGame')))
      },
      {
        menuType: 1,
        menuName: "順位",
        path: '/league_ranking',
        icon: "OrderedListOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/league/LeagueRanking')))
      },
    ]
  },
  {
    menuType: 1,
    menuName: "カップ戦",
    path: '',
    icon: "TrophyOutlined",
    children: [
      {
        menuType: 1,
        menuName: "一覧",
        path: '/cups',
        icon: "ProfileOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/cup')))
      },
      {
        menuType: 1,
        menuName: "日程",
        path: '/cup_schedule',
        icon: "CalendarOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/cup/CupGame')))
      },
      {
        menuType: 1,
        menuName: "データ",
        path: '/cup_data',
        icon: "DatabaseOutlined",
        element: lazyLoad(React.lazy(() => import('@/views/cup/CupRanking')))
      },
    ]
  },
  {
    menuType: 1,
    menuName: "ニュース管理",
    path: '/news',
    icon: "PicLeftOutlined",
    element: lazyLoad(React.lazy(() => import('@/views/news')))
  },
]

export const router = [
  {
    path: '/',
    element: <Navigate to='/schedule' />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    id: 'layout',
    element: <Layout />,
    children: getRouterInfo(routerMenu),
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <Error404 />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

export default createHashRouter(router)
