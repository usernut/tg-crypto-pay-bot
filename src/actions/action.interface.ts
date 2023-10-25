import { IContext } from '../common'

export abstract class Action {
	abstract handler(ctx: IContext, next?: () => Promise<void>): Promise<void>
}
