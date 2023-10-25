import { IContext } from '../../common'
import { CreatedDepositInfo } from './create-deposit-into.interface'

export interface IDepositService {
	create(ctx: IContext, amount: number): Promise<CreatedDepositInfo>

	cancel(ctx: IContext): Promise<void>
}
