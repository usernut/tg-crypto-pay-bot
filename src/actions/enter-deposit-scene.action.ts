import { IContext } from '../common'
import { ILoggerService, logger } from '../logger'
import { SCENE } from '../scenes'
import { ACTION } from './action.constants'
import { Action } from './action.interface'

class EnterDepositSceneAction implements Action {
	constructor(private readonly logger: ILoggerService) {}

	handler = async (ctx: IContext): Promise<void> => {
		try {
			await ctx.scene.enter(SCENE.USER.DEPOSIT)
		} catch (error) {
			this.logger.error(`Ошибка при выполнении экшена ${ACTION.USER.DEPOSIT}`, {
				action: ACTION.USER.DEPOSIT,
				userId: ctx.chat.id,
				error
			})
		}
	}
}

export const enterDepositSceneAction = new EnterDepositSceneAction(logger)
