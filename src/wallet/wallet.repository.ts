import { WalletStatus, Wallets } from '@prisma/client'
import { Transaction } from '../common/types'
import { IWalletRepository } from './interfaces'
import { NoFreeWalletsError } from './wallets.errors'

class WalletRepository implements IWalletRepository {
	async reserveFreeWithTransaction(tx: Transaction): Promise<Wallets> {
		const wallet = await tx.wallets.findFirst({
			where: {
				status: WalletStatus.FREE
			}
		})

		if (!wallet) {
			throw new NoFreeWalletsError('Все кошельки заняты')
		}

		await this.updateWalletStatusWithTransaction(
			tx,
			wallet.id,
			WalletStatus.RESERVED
		)

		return wallet
	}

	async updateWalletStatusWithTransaction(
		tx: Transaction,
		walletId: number,
		status: WalletStatus
	): Promise<Wallets> {
		return tx.wallets.update({
			data: {
				status
			},
			where: {
				id: walletId
			}
		})
	}
}

export const walletRepository = new WalletRepository()
