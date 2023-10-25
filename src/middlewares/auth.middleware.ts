import { message } from 'telegraf/filters'
import { IContext } from '../common'
import { ILoggerService, logger } from '../logger'
import { IUserRepository } from '../user'
import { userRepository } from '../user/user.repository'

class AuthMiddleware {
	constructor(
		private readonly logger: ILoggerService,
		private readonly userRepository: IUserRepository
	) {}

	middleware =
		() =>
		async (ctx: IContext, next: () => Promise<void>): Promise<void> => {
			try {
				if (ctx.session.isAuthenticated) {
					return next()
				}

				let refferal: string

				if (ctx.has(message('text'))) {
					refferal = ctx.message.text.match(/^\/start (.+)/)?.at(1)
				}

				await this.userRepository.getOrCreate(ctx.chat.id, refferal)
				this.logger.log(
					`Пользователь ${ctx.chat.id} успешно авторизатован, реферал ${refferal}`,
					{ userId: ctx.chat.id, refferal }
				)

				ctx.session.isAuthenticated = true

				next()
			} catch (error) {
				this.logger.error(
					`Во время авторизации пользователя ${ctx.chat.id} произошла ошибка`,
					{
						userId: ctx.chat.id,
						error
					}
				)
			}
		}
}

export const auth = new AuthMiddleware(logger, userRepository)
