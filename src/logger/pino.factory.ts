import pino, { Logger, levels, stdTimeFunctions } from 'pino'
import { ILoggerFactory } from './logger.interface'

class PinoFactory implements ILoggerFactory {
	createProduction(): Logger {
		return pino({
			sync: false,
			formatters: {
				level: label => {
					return { level: label.toUpperCase() }
				}
			},
			timestamp: stdTimeFunctions.isoTime,
			transport: {
				target: 'pino/file',
				options: { destination: `${process.cwd()}/logs/app.log` }
			}
		})
	}

	createDevelopment(): Logger {
		return pino({
			sync: false,
			mixin(_context, level) {
				return { 'level-label': levels.labels[level].toUpperCase() }
			},
			timestamp: stdTimeFunctions.isoTime,
			transport: {
				targets: [
					{
						level: 'info',
						target: 'pino/file',
						options: {
							destination: `${process.cwd()}/logs/app.log`
						}
					},
					{
						level: 'info',
						target: 'pino-pretty',
						options: {}
					}
				]
			}
		})
	}
}

export const pinoFactory = new PinoFactory()
