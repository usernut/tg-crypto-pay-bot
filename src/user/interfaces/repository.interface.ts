import { Users } from '@prisma/client'
import { Transaction } from '../../common/types'

export interface IUserRepository {
	get(id: number | bigint): Promise<Users>

	getOrCreate(id: number | bigint, refferal?: string | null): Promise<Users>

	incementBalanceByIdWithTransaction(
		tx: Transaction,
		userId: number | bigint,
		amount: number
	): Promise<Users>
}
