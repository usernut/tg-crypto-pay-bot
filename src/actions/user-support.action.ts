import { IContext, comeBackKeyboard } from '../common'
import { ILoggerService, logger } from '../logger'
import { ACTION } from './action.constants'
import { Action } from './action.interface'

class UserSupportAction implements Action {
	constructor(private readonly logger: ILoggerService) {}

	handler = async (ctx: IContext): Promise<void> => {
		try {
			await ctx.editMessageText(
				ctx.i18n.t('user.support'),
				comeBackKeyboard(ACTION.USER.MENU)
			)
		} catch (error) {
			this.logger.error(`Ошибка при выполнении экшена ${ACTION.USER.SUPPORT}`, {
				action: ACTION.USER.SUPPORT,
				userId: ctx.chat.id,
				error
			})
		}
	}
}

export const userSupportAction = new UserSupportAction(logger)
