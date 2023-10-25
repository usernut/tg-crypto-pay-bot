import { IContext } from '../common'

export abstract class Command {
	abstract handler(ctx: IContext, next: () => Promise<void>): Promise<void>
}
