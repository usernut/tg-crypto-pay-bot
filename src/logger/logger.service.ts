import pinoLogger, { Logger } from 'pino'
import { IContext } from '../common'
import { ILoggerService } from './logger.interface'
// TODO: смена места сохранения логов для production # process.env.NODE_ENV === 'production'
// Перегрузки
class PinoLoggerService implements ILoggerService {
	private readonly pino: Logger

	constructor() {
		this.pino = pinoLogger({
			formatters: {
				level: label => {
					return { level: label.toUpperCase() }
				}
			},
			timestamp: pinoLogger.stdTimeFunctions.isoTime,
			transport: {
				target: 'pino-pretty'
			}
		})
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

export const logger = new PinoLoggerService()
