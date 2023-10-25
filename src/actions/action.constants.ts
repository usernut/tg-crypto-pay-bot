export const ACTION = {
	USER: {
		CANCEL_DEPOSIT: 'cancel_deposit',
		SUPPORT: 'user_support',
		MENU: 'user_menu',
		PROFILE: 'user_profile',
		DEPOSIT: 'user_deposit',
		DEPOSIT_HISTORY: 'user_deposit_history'
	},
	ADMIN: {
		MENU: 'admin_menu'
	}
} as const

export type ActionType =
	| (typeof ACTION.USER)[keyof typeof ACTION.USER]
	| (typeof ACTION.ADMIN)[keyof typeof ACTION.ADMIN]
