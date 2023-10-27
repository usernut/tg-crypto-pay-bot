import { Logger } from 'pino'

export interface ILoggerService {
	log(message: string, data?: object): void
	error(message: string, data?: object): void
	warn(message: string, data?: object): void
}

export interface ILoggerFactory {
	createDevelopment(): Logger
	createProduction(): Logger
}
