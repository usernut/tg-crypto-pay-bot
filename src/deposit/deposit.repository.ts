import { DepositStatus, Prisma, WalletStatus } from '@prisma/client'
import { Transaction } from '../common/types'
import { IPrismaService, prismaService } from '../database'
import { IUserRepository, userRepository } from '../user'
import { IWalletRepository, walletRepository } from '../wallet'
import {
	DepositAlredyCompletedError,
	DepositNoDefinedError
} from './deposit.errors'
import { CreatedDepositInfo, IDepositRepository } from './interfaces'

class DepositRepository implements IDepositRepository {
	constructor(
		private readonly prismaService: IPrismaService,
		private readonly walletRepository: IWalletRepository,
		private readonly userRepository: IUserRepository
	) {}

	async create(
		userId: number,
		amount: number,
		expiredIn: number = 15
	): Promise<CreatedDepositInfo> {
		return this.prismaService.$transaction(
			async tx => {
				const wallet =
					await this.walletRepository.reserveFreeWithTransaction(tx)

				const expiredAt = new Date()
				expiredAt.setMinutes(expiredAt.getMinutes() + expiredIn)

				const deposit = await tx.deposits.create({
					data: {
						userId,
						walletId: wallet.id,
						amount,
						expiredAt
					}
				})

				return {
					id: deposit.id,
					userId,
					amount,
					expiredIn,
					wallet: wallet.addres
				}
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead
			}
		)
	}

	/*
	 * Транзакция:
	 *  1. Подтвержает платеж (устанавливает: время платежа, id транзакции и сумму оплаты)
	 *  2. Осовобождает кошелек для пополнения
	 *  3. Начисляет сумму пополнения пользователю
	 */
	async confirm(
		depositId: number,
		txid: string,
		paidAmount: number
	): Promise<void> {
		return this.prismaService.$transaction(
			async tx => {
				const deposit = await this.getActiveDepositByIdWithTransaction(
					tx,
					depositId
				)

				await tx.deposits.update({
					data: {
						txid,
						paidAmount,
						status: DepositStatus.PAID,
						paidAt: new Date()
					},
					where: {
						id: depositId
					}
				})

				await this.userRepository.incementBalanceByIdWithTransaction(
					tx,
					deposit.userId,
					paidAmount
				)

				await this.walletRepository.updateWalletStatusWithTransaction(
					tx,
					deposit.walletId,
					WalletStatus.FREE
				)
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead
			}
		)
	}

	async cancel(
		depositId: number,
		depositStatus: Extract<DepositStatus, 'EXPIRED' | 'CANCELLED'>
	): Promise<void> {
		return this.prismaService.$transaction(
			async tx => {
				const deposit = await this.getActiveDepositByIdWithTransaction(
					tx,
					depositId
				)

				await tx.deposits.update({
					data: {
						status: depositStatus,
						paidAt: new Date()
					},
					where: {
						id: depositId
					}
				})

				await this.walletRepository.updateWalletStatusWithTransaction(
					tx,
					deposit.walletId,
					WalletStatus.FREE
				)
			},
			{
				isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
			}
		)
	}

	private async getActiveDepositByIdWithTransaction(
		tx: Transaction,
		depositId: number
	) {
		const deposit = await tx.deposits.findFirst({
			where: {
				id: depositId
			}
		})

		if (!deposit) {
			throw new DepositNoDefinedError(`Платеж ${depositId} не существует`)
		}

		if (deposit.status !== DepositStatus.INPROGRESS) {
			throw new DepositAlredyCompletedError(`Платеж ${depositId} уже завершен`)
		}

		return deposit
	}
}

export const depositRepository = new DepositRepository(
	prismaService,
	walletRepository,
	userRepository
)
