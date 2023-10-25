export class DepositNoDefinedError extends Error {
	constructor(message: string) {
		super(message)
	}
}

export class DepositAlredyCompletedError extends Error {
	constructor(message: string) {
		super(message)
	}
}
