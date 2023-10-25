import { Users } from '@prisma/client'
import { Transaction } from '../../common/types'

export interface IUserRepository {
	get(id: number): Promise<Users>

	getOrCreate(id: number, refferal?: string | null): Promise<Users>

	incementBalanceByIdWithTransaction(
		tx: Transaction,
		userId: number,
		amount: number
	): Promise<Users>
}
