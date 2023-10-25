import { WalletStatus, Wallets } from '@prisma/client'
import { Transaction } from '../../common/types'

export interface IWalletRepository {
	reserveFreeWithTransaction(tx: Transaction): Promise<Wallets>

	updateWalletStatusWithTransaction(
		tx: Transaction,
		walletId: number,
		status: WalletStatus
	): Promise<Wallets>
}
