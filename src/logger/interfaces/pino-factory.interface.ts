import { Logger } from 'pino'

export interface ILoggerFactory {
	createDevelopment(): Logger
	createProduction(): Logger
}