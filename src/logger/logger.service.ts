import { Logger } from 'pino'
import { IContext } from '../common'
import { ILoggerFactory, ILoggerService } from './interfaces'
import { pinoFactory } from './pino.factory'
// TODO: Перегрузки
class PinoLoggerService implements ILoggerService {
	private readonly pino: Logger

	constructor(private readonly pinoFactory: ILoggerFactory) {
		this.pino =
			process.env.NODE_ENV === 'production'
				? this.pinoFactory.createProduction()
				: this.pinoFactory.createDevelopment()
	}

	private getRequestData = (ctx: IContext) => {
		return ctx && { userId: ctx.chat.id, requestId: ctx.requestId }
	}

	// log(message: string, ctx: IContext, data?: object): void
	log(message: string, data?: object): void {
		// const requestData = this.getRequestData(ctx)
		this.pino.info({ ...data }, message)
	}

	// error(message: string, ctx: IContext, data?: object): void
	error(message: string, data?: object): void {
		// const requestData = this.getRequestData(ctx)
		this.pino.error({ ...data }, message)
	}

	// warn(message: string, ctx: IContext, data?: object): void
	warn(message: string, data?: object): void {
		// const requestData = this.getRequestData(ctx)
		this.pino.warn({ ...data }, message)
	}
}

export const logger = new PinoLoggerService(pinoFactory)
