import { Telegraf } from 'telegraf'
import { IContext } from '../common'
import { COMMAND } from './command.constants'
import { startCommand } from './start.command'

export const initCommands = (bot: Telegraf<IContext>) => {
	bot.command(COMMAND.START, startCommand.handler)
}
