import { create } from 'zustand'
import storage from '@/utils/storage'

export const useStore = create<{
  token: string
  collapsed: boolean
  isDark: boolean
  updateToken: (token: string) => void
  updateCollapsed: () => void
  updateTheme: (isDark: boolean) => void
}>(set => ({
  token: '',
  collapsed: false,
  isDark: storage.get('isDark') || false,
  updateToken: token => set({ token }),
  updateTheme: isDark => set({ isDark }),
  updateCollapsed: () =>
    set(state => {
      return {
        collapsed: !state.collapsed
      }
    })
}))
