import { I18nContext } from '@esindger/telegraf-i18n'
import { Context, Scenes } from 'telegraf'

interface SessionData extends Scenes.WizardSession<Scenes.WizardSessionData> {
	isAuthenticated: boolean
}

export interface IContext extends Context {
	i18n: I18nContext
	requestId: string
	session: SessionData
	scene: Scenes.SceneContextScene<IContext, Scenes.WizardSessionData>
	wizard: Scenes.WizardContextWizard<IContext>
}
