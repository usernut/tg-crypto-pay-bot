import { Users } from '@prisma/client'
import { Transaction } from '../common/types'
import { IPrismaService, prismaService } from '../database'
import { IUserRepository } from './interfaces'

class UserRepository implements IUserRepository {
	constructor(private readonly prismaService: IPrismaService) {}

	get(id: number | bigint): Promise<Users> {
		return this.prismaService.users.findUnique({
			where: { id }
		})
	}

	async getOrCreate(id: number | bigint, refferal?: string | null): Promise<Users> {
		const user = await this.get(id)

		if (user) {
			return user
		}

		return this.prismaService.users.create({
			data: { id, refferal }
		})
	}

	incementBalanceByIdWithTransaction(
		tx: Transaction,
		userId: number | bigint,
		amount: number
	): Promise<Users> {
		return tx.users.update({
			data: {
				balance: {
					increment: amount
				}
			},
			where: {
				id: userId
			}
		})
	}
}

export const userRepository = new UserRepository(prismaService)
