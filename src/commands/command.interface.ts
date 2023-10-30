import { IContext } from '../common'

export interface ICommand {
	handler(ctx: IContext, next: () => Promise<void>): Promise<void>
}
