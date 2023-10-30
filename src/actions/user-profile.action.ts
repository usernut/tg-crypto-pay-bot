import { IContext, userProfileKeyboard } from '../common'
import { ILoggerService, logger } from '../logger'
import { IUserRepository, userRepository } from '../user'
import { ACTION } from './action.constants'
import { IAction } from './action.interface'

class UserProfileAction implements IAction {
	constructor(
		private readonly logger: ILoggerService,
		private readonly userRepository: IUserRepository
	) {}

	handler = async (ctx: IContext): Promise<void> => {
		try {
			const user = await this.userRepository.get(ctx.chat.id) // TODO: Cache

			await ctx.editMessageText(
				ctx.i18n.t('user.profile', { balance: user.balance }),
				userProfileKeyboard()
			)
		} catch (error) {
			this.logger.error(`Ошибка при выполнении экшена ${ACTION.USER.PROFILE}`, {
				action: ACTION.USER.PROFILE,
				userId: ctx.chat.id,
				error
			})
		}
	}
}

export const userProfileAction = new UserProfileAction(logger, userRepository)
