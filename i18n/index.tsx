/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhMessages from './messages/zh.json'
import enMessages from './messages/en.json'

const resources = {
	zh: { translation: zhMessages },
	en: { translation: enMessages }
}

let initialized = false

function initI18n() {
	if (initialized) return

	const getInitialLanguage = (): string => {
		if (typeof window === 'undefined') return 'zh'
		const savedLang = localStorage.getItem('language')
		if (savedLang === 'zh' || savedLang === 'en') return savedLang
		const systemLang = navigator.language.toLowerCase()
		if (systemLang.startsWith('zh')) return 'zh'
		return 'en'
	}

	i18n.use(initReactI18next).init({
		resources,
		lng: getInitialLanguage(),
		fallbackLng: 'zh',
		interpolation: {
			escapeValue: false
		}
	})

	i18n.on('languageChanged', (lng) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('language', lng)
			document.cookie = `language=${lng};path=/;max-age=31536000`
		}
	})

	initialized = true
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		initI18n()
		setIsReady(true)
	}, [])

	if (!isReady) {
		return null
	}

	return <>{children}</>
}

export default i18n
