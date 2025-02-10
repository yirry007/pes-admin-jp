// 接口类型定义

export interface Result<T = any> {
  code: string
  result?: T
  message: string
}
export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

export interface PageParams {
  pageNum: number
  pageSize?: number
}
export namespace Login {
  export interface params {
    username: string
    password: string
  }
}
// 用户管理
export namespace User {
  export interface Params extends PageParams {
    phone?: string
    nickname?: string
  }
  export interface SearchParams {
    phone?: string
    nickname?: string
  }
  export interface UserItem {
    id: number
    code: string
    phone: string
    openid: string
    head_image_url: string
    nickname: string
    point: number
    tags: string
  }
  export interface CreateParams {
    phone: string
    head_image_url: string
    nickname: string
    point?: number
    tags?: string
  }
  export interface EditParams extends CreateParams {
    id: number
  }
}

// 球员管理
export namespace Player {
  export interface Params extends PageParams {
    name?: string
    nation?: string
    position?: string
    rating_start?: number
    rating_end?: number
  }
  export interface SearchParams {
    name?: string
    nation?: string
    position?: string
    rating_start?: number
    rating_end?: number
  }
  export interface PlayerItem {
    id: number
    code: string
    name: string
    name_en: string
    full_name: string
    image_url: string
    nation: string
    nation_abbr: string
    nation_image: string
    age: string
    height: number
    weight: number
    position: string
    strong_foot: string
    rating: number
    data: string
  }
}

// 联赛管理
export namespace League {
  export interface Params extends PageParams {
    name?: string
  }
  export interface SearchParams {
    name?: string
  }
  export interface LeagueItem {
    id: number
    name: string
    apply_mode: number
    user_number: number
    game_mode: number
    apply_time: string
    start_date: string
    end_date: string
    memo: string
  }
  export interface CreateParams {
    name: string
    apply_mode?: number
    user_number: number
    game_mode?: number
    apply_time?: string
    start_date: string
    end_date: string
    memo?: string
  }
  export interface EditParams extends CreateParams {
    id: number
  }
}

// 杯赛管理
export namespace Cup {
  export interface Params extends PageParams {
    name?: string
  }
  export interface SearchParams {
    name?: string
  }
  export interface CupItem {
    id: number
    name: string
    apply_mode: number
    user_number: number
    apply_time: string
    start_date: string
    end_date: string
    memo: string
  }
  export interface CreateParams {
    name: string
    apply_mode?: number
    user_number: number
    apply_time?: string
    start_date: string
    end_date: string
    memo?: string
  }
  export interface EditParams extends CreateParams {
    id: number
  }
}

// 新闻管理
export namespace News {
  export interface Params extends PageParams {
    title?: string
  }
  export interface SearchParams {
    title?: string
  }
  export interface NewsItem {
    id: number
    is_banner: number
    title: string
    subject: string
    image: string
    url: string
    sort: number
    is_use: number
    create_at: string
  }
  export interface CreateParams {
    is_banner?: number
    title: string
    subject?: string
    image?: string
    url?: string
    sort?: number
    is_use?: number
  }
  export interface EditParams extends CreateParams {
    id: number
  }
}

export namespace Menu {
  // 菜单创建
  export interface CreateParams {
    menuName: string // 菜单名称
    icon?: string // 菜单图标
    menuType: number // 1: 菜单 2：按钮 3：页面
    menuState: number // 1：正常 2：停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
  }
  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    buttons?: MenuItem[]
    children?: MenuItem[]
  }
  export interface EditParams extends CreateParams {
    _id?: string
  }

  export interface DelParams {
    _id: string
  }
}