import { DepositStatus } from '@prisma/client'
import { CreatedDepositInfo } from './create-deposit-into.interface'

export interface IDepositRepository {
	create(
		userId: number,
		amount: number,
		expiredIn: number
	): Promise<CreatedDepositInfo>

	confirm(depositId: number, txid: string, paidAmount: number): Promise<void>

	cancel(
		depositId: number,
		depositStatus: Extract<DepositStatus, 'EXPIRED' | 'CANCELLED'>
	): Promise<void>
}
