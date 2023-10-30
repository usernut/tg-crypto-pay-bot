import { ExtraEditMessageText } from 'telegraf/typings/telegram-types'
import { ACTION, ActionType } from '../actions'

export const userProfileKeyboard = (): ExtraEditMessageText => {
	return {
		parse_mode: 'Markdown',
		reply_markup: {
			inline_keyboard: [
				[{ text: '➕ Пополнить', callback_data: ACTION.USER.ENTER_DEPOSIT }],
				[
					{
						text: '🗳 История пополнений',
						callback_data: ACTION.USER.DEPOSIT_HISTORY
					}
				],
				[{ text: 'Назад', callback_data: ACTION.USER.MENU }]
			]
		}
	}
}

export const userMenuKeyboard = (): ExtraEditMessageText => {
	return {
		parse_mode: 'Markdown',
		reply_markup: {
			inline_keyboard: [
				[
					{ text: '💭 Поддержка', callback_data: ACTION.USER.SUPPORT },
					{ text: '🧑🏽‍💻 Профиль', callback_data: ACTION.USER.PROFILE }
				]
			]
		}
	}
}

export const returnToUserMenuKeyboard = (): ExtraEditMessageText => {
	return {
		parse_mode: 'Markdown',
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Вернуться в главное меню',
						callback_data: ACTION.USER.MENU
					}
				]
			]
		}
	}
}

export const cancelKeyboard = (
	callback_data: ActionType
): ExtraEditMessageText => {
	return {
		parse_mode: 'Markdown',
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: '🚫 Отмена',
						callback_data
					}
				]
			]
		}
	}
}

export const comeBackKeyboard = (
	callback_data: ActionType
): ExtraEditMessageText => {
	return {
		parse_mode: 'Markdown',
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Назад',
						callback_data
					}
				]
			]
		}
	}
}
