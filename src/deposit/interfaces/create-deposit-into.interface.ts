export interface CreatedDepositInfo {
	id: number
	userId: number | bigint
	amount: number
	expiresIn: number
	wallet: string
}
