import { Scenes } from 'telegraf'
import { callbackQuery, message } from 'telegraf/filters'
import { ACTION } from '../actions'
import { IContext, comeBackKeyboard, returnToUserMenuKeyboard } from '../common'
import { depositService } from '../deposit'
import { logger } from '../logger'
import { SCENE } from './scene.constants'

const scene = new Scenes.WizardScene<IContext>(
	SCENE.USER.DEPOSIT,
	async ctx => {
		try {
			logger.log(`Пользователь ${ctx.chat.id} начал сцену платежа`, {
				userId: ctx.chat.id,
				scene: SCENE.USER.DEPOSIT,
				step: 1
			})

			await ctx.editMessageText(
				ctx.i18n.t('user.deposit_scene.enter_deposit_amount'),
				comeBackKeyboard(ACTION.USER.CANCEL_DEPOSIT)
			)

			return ctx.wizard.next()
		} catch (error) {
			logger.error('Необработнная ошибка при создании депозита', {
				userId: ctx.chat.id,
				message: ctx.message,
				scene: SCENE.USER.DEPOSIT,
				step: 1
			})
		}
	},
	async (ctx, next) => {
		try {
			if (ctx.has(callbackQuery('data'))) {
				if (ctx.callbackQuery.data === ACTION.USER.CANCEL_DEPOSIT) {
					await depositService.cancel(ctx)
					return
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

				let deposit = await depositService.create(ctx, +amount)

				if (!deposit) {
					return
				}

				logger.log(
					`Пользователь ${ctx.chat.id} создал платеж на сумму ${amount} USDT`,
					{ userId: ctx.chat.id, scene: SCENE.USER.DEPOSIT, step: 2 }
				)

				await ctx.reply(
					ctx.i18n.t('user.deposit_scene.created', {
						amount,
						wallet: deposit.wallet,
						expiresIn: deposit.expiredIn
					}),
					returnToUserMenuKeyboard()
				)

				return
			}

			logger.warn(
				`Пользователь ${ctx.chat.id} ввел некорректную сумму платежа ${ctx.message}`,
				{
					userId: ctx.chat.id,
					message: ctx.message,
					scene: SCENE.USER.DEPOSIT,
					step: 2
				}
			)
			await ctx.reply(ctx.i18n.t('user.deposit_scene.enter_correct_amount'))
		} catch (error) {
			logger.error('Необработнная ошибка при создании депозита', {
				userId: ctx.chat.id,
				message: ctx.message,
				scene: SCENE.USER.DEPOSIT,
				step: 2
			})
		}
	}
)

export const depositScene = new Scenes.Stage([scene])
