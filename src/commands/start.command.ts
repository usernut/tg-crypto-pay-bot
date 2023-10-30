import { Message } from 'telegraf/typings/core/types/typegram'
import { IContext, userMenuKeyboard } from '../common'
import { ILoggerService } from '../logger'
import { logger } from '../logger/logger.service'
import { ICommand } from './command.interface'

class StartCommand implements ICommand {
	constructor(private readonly logger: ILoggerService) {}

	handler = async (ctx: IContext): Promise<void> => {
		try {
			await ctx.reply(ctx.i18n.t('greeting'), userMenuKeyboard())
		} catch (error) {
			this.logger.error('Ошибка при выполнении команды start', {
				command: 'start',
				userId: ctx.chat.id,
				message: (ctx.message as Message.TextMessage).text,
				error
			})
		}
	}
}

export const startCommand = new StartCommand(logger)
