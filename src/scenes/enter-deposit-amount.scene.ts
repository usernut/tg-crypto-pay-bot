import { Scenes } from 'telegraf'
import { callbackQuery, message } from 'telegraf/filters'
import { ACTION } from '../actions'
import { IContext, comeBackKeyboard } from '../common'
import { IDepositService, depositService } from '../deposit'
import { logger } from '../logger'
import { SCENE } from './scene.constants'
import { IScene } from './scene.interface'

class DepositScene implements IScene {
	constructor(private readonly depositService: IDepositService) {}

	create() {
		const stages = new Scenes.WizardScene<IContext>(
			SCENE.USER.DEPOSIT,
			this.startScene,
			this.handleUserAmountInputOrCancel
		)

		return new Scenes.Stage([stages])
	}

	private startScene = async (ctx: IContext) => {
		try {
			logger.log(`Пользователь ${ctx.chat.id} начал сцену платежа`, {
				userId: ctx.chat.id,
				scene: SCENE.USER.DEPOSIT,
				step: 1
			})

			await ctx.editMessageText(
				ctx.i18n.t('user.deposit_scene.enter_deposit_amount'),
				comeBackKeyboard(ACTION.USER.PROFILE)
			)

			return ctx.wizard.next()
		} catch (error) {
			logger.error('Необработанная ошибка при создании депозита', {
				userId: ctx.chat.id,
				message: ctx.message,
				scene: SCENE.USER.DEPOSIT,
				step: 1,
				error
			})
		}
	}

	private handleUserAmountInputOrCancel = async (
		ctx: IContext,
		next: () => Promise<void>
	) => {
		try {
			if (ctx.has(callbackQuery('data'))) {
				if (ctx.callbackQuery.data === ACTION.USER.PROFILE) { //  ACTION.USER.CANCEL_DEPOSIT
					return await this.depositService.cancel(ctx)
				}

				return next()
			}

			if (ctx.has(message('text'))) {
				const amount = ctx.message.text

				if (!(Number(amount) > 0.01)) {
					logger.warn(
						`Пользователь ${ctx.chat.id} ввел некорректную сумму платежа ${amount}`,
						{
							userId: ctx.chat.id,
							scene: SCENE.USER.DEPOSIT,
							step: 2,
							message: amount
						}
					)
					await ctx.reply(ctx.i18n.t('user.deposit_scene.enter_correct_amount'))

					return
				}

				await ctx.scene.leave()

				await this.depositService.create(ctx, +amount)

				return
			}

			await ctx.reply(ctx.i18n.t('user.deposit_scene.enter_correct_amount'))
		} catch (error) {
			logger.error('Необработнная ошибка при создании депозита', {
				userId: ctx.chat.id,
				message: ctx.message,
				scene: SCENE.USER.DEPOSIT,
				step: 2,
				error
			})
		}
	}
}

export const depositScene = new DepositScene(depositService).create()
