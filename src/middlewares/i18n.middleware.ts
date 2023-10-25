import { I18n } from '@esindger/telegraf-i18n'
import path from 'path'

export const i18n = new I18n({
	directory: path.resolve(process.cwd(), 'src/locales'),
	defaultLanguage: 'ru',
	defaultLanguageOnMissing: true,
	useSession: true
})
