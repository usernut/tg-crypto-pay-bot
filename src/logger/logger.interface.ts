export interface ILoggerService {
	log(message: string, data?: object): void
	error(message: string, data?: object): void
	warn(message: string, data?: object): void
}
