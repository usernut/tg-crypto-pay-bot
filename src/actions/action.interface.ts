import { IContext } from '../common'

export interface IAction {
	handler(ctx: IContext, next?: () => Promise<void>): Promise<void>
}
