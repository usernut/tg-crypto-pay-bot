import { randomUUID } from 'node:crypto'
import { callbackQuery, message } from 'telegraf/filters'
import { IContext } from '../common'
import { ILoggerService, logger } from '../logger'

class RequestLoggerMiddleware {
	constructor(private readonly logger: ILoggerService) {}
	middleware =
		() =>
		async (ctx: IContext, next: () => Promise<void>): Promise<void> => {
			ctx.requestId = randomUUID()

			if (ctx.has(callbackQuery('data'))) {
				this.logger.log(
					`Пользователь ${ctx.chat.id} отправил экшн: ${ctx.callbackQuery.data}`
				)
			}

			if (ctx.has(message('text'))) {
				this.logger.log(
					`Пользователь ${ctx.chat.id} отправил сообщение: ${ctx.message.text}`
				)
			}

			next()
		}
}

export const requestLogger = new RequestLoggerMiddleware(logger)
