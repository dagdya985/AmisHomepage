import { create } from 'zustand'
import i18n from '../../i18n'

export type Language = 'zh' | 'en'

interface LanguageStore {
	language: Language
	hydrated: boolean
	setLanguage: (lang: Language) => void
	toggleLanguage: () => void
	hydrate: () => void
}

function getSystemLanguage(): Language {
	if (typeof window === 'undefined') return 'zh'
	const systemLang = navigator.language.toLowerCase()
	if (systemLang.startsWith('zh')) return 'zh'
	return 'en'
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
	language: 'zh',
	hydrated: false,

	setLanguage: (lang: Language) => {
		i18n.changeLanguage(lang)
		set({ language: lang })
	},

	toggleLanguage: () => {
		const { language, setLanguage } = get()
		setLanguage(language === 'zh' ? 'en' : 'zh')
	},

	hydrate: () => {
		const savedLang = localStorage.getItem('language') as Language | null
		const initialLang = savedLang && (savedLang === 'zh' || savedLang === 'en')
			? savedLang
			: getSystemLanguage()
		i18n.changeLanguage(initialLang)
		set({ language: initialLang, hydrated: true })
	}
}))

export { useTranslation } from 'react-i18next'
