import { Telegraf } from 'telegraf'
import { IContext } from '../common'
import { ACTION } from './action.constants'
import { enterDepositSceneAction } from './enter-deposit-scene.action'
import { userMenuAction } from './user-menu.action'
import { userProfileAction } from './user-profile.action'
import { userSupportAction } from './user-support.action'

export * from './action.constants'
export * from './action.interface'

export const initActions = (bot: Telegraf<IContext>) => {
	bot.action(ACTION.USER.SUPPORT, userSupportAction.handler)
	bot.action(ACTION.USER.MENU, userMenuAction.handler)
	bot.action(ACTION.USER.PROFILE, userProfileAction.handler)
	bot.action(ACTION.USER.DEPOSIT, enterDepositSceneAction.handler)
}
