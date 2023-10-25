import { IContext, userMenuKeyboard } from '../common'
import { ILoggerService, logger } from '../logger'
import { ACTION } from './action.constants'
import { Action } from './action.interface'

class UserMenuAction implements Action {
	constructor(private readonly logger: ILoggerService) {}

	handler = async (ctx: IContext): Promise<void> => {
		try {
			await ctx.editMessageText(ctx.i18n.t('greeting'), userMenuKeyboard())
		} catch (error) {
			this.logger.error(`Ошибка при выполнении экшена ${ACTION.USER.MENU}`, {
				action: ACTION.USER.MENU,
				userId: ctx.chat.id,
				error
			})
		}
	}
}

export const userMenuAction = new UserMenuAction(logger)
