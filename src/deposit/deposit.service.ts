import { ACTION, IAction } from '../actions'
import { userProfileAction } from '../actions/user-profile.action'
import { IContext, returnToUserMenuKeyboard } from '../common'
import { ILoggerService, logger } from '../logger'
import { SCENE } from '../scenes'
import { NoFreeWalletsError } from '../wallet'
import { depositRepository } from './deposit.repository'
import {
	CreatedDepositInfo,
	IDepositRepository,
	IDepositService
} from './interfaces'

class DepositService implements IDepositService {
	constructor(
		private readonly logger: ILoggerService,
		private readonly userProfileAction: IAction,
		private readonly depositRepository: IDepositRepository
	) {}

	async create(
		ctx: IContext,
		amount: number
	): Promise<CreatedDepositInfo | null> {
		try {
			const deposit = await this.depositRepository.create(ctx.chat.id, +amount)

			this.logger.log(
				`Пользователь ${ctx.chat.id} создал платеж на сумму ${amount} USDT`,
				{ userId: ctx.chat.id, scene: SCENE.USER.DEPOSIT, step: 2 }
			)

			await ctx.reply(
				ctx.i18n.t('user.deposit_scene.created', {
					amount,
					wallet: deposit.wallet,
					expiresIn: deposit.expiresIn
				}),
				returnToUserMenuKeyboard()
			)

			return deposit
		} catch (error) {
			if (error instanceof NoFreeWalletsError) {
				this.logger.error(
					`Не удалось создать платеж для пользователя ${ctx.chat.id}, нет свободных кошельков`,
					{ userId: ctx.chat.id, error, scene: SCENE.USER.DEPOSIT, step: 2 }
				)

				await ctx.reply(
					ctx.i18n.t('user.deposit_scene.no_free_wallets'),
					returnToUserMenuKeyboard()
				)

				return null
			}

			// TODO: Если serialize error: log with retry number, ретрай (макс 3)

			this.logger.error(
				`Ошибка при создании платежа для пользователя ${ctx.chat.id}`,
				{ userId: ctx.chat.id, error, scene: SCENE.USER.DEPOSIT, step: 2 }
			)

			await ctx.reply(
				ctx.i18n.t('user.deposit_scene.error_creating_deposit'),
				returnToUserMenuKeyboard()
			)

			return null
		}
	}

	async cancel(ctx: IContext): Promise<void> {
		await ctx.scene.leave()

		this.logger.log(
			`Пользователь ${ctx.chat.id} отменил платеж на стадии ввода суммы платежа`,
			{
				userId: ctx.chat.id,
				scene: SCENE.USER.DEPOSIT,
				step: 2,
				action: ACTION.USER.CANCEL_DEPOSIT
			}
		)

		this.userProfileAction.handler(ctx)
	}
}

export const depositService = new DepositService(
	logger,
	userProfileAction,
	depositRepository
)
