/**
 * 认证状态管理钩子
 * 用于管理用户认证状态和相关操作
 */
import { create } from 'zustand'
import { clearAllAuthCache, getPemFromCache, savePemToCache } from '@/lib/auth'
import { useConfigStore } from '@/app/(home)/stores/config-store'

/**
 * 认证状态接口
 */
interface AuthStore {
	// 状态
	isAuth: boolean // 是否已认证
	privateKey: string | null // 私钥内容

	// 操作
	setPrivateKey: (key: string) => void // 设置私钥
	clearAuth: () => void // 清除认证状态
}

/**
 * 认证状态存储
 */
export const useAuthStore = create<AuthStore>((set) => ({
	isAuth: false,
	privateKey: null,

	/**
	 * 设置私钥并更新认证状态
	 * @param key 私钥字符串
	 */
	setPrivateKey: async (key: string) => {
		set({ isAuth: true, privateKey: key })
		const { siteContent } = useConfigStore.getState()
		if (siteContent?.isCachePem) {
			await savePemToCache(key)
		}
	},

	/**
	 * 清除认证状态
	 */
	clearAuth: () => {
		clearAllAuthCache()
		set({ isAuth: false, privateKey: null })
	}
}))

// 从缓存中获取私钥并更新状态
getPemFromCache().then((key) => {
	if (key) {
		useAuthStore.setState({ privateKey: key, isAuth: true })
	}
})
