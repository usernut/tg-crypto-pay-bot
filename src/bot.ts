import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { initActions } from './actions'
import { initCommands } from './commands'
import { IContext } from './common'
import { auth, i18n, requestLogger, session } from './middlewares'
import { depositScene } from './scenes'

dotenv.config()

if (!process.env.BOT_TOKEN) {
	throw new TypeError('BOT_TOKEN must be provided!')
}

const bot = new Telegraf<IContext>(process.env.BOT_TOKEN)

bot.use(
	session.middleware(),
	requestLogger.middleware(),
	auth.middleware(),
	i18n.middleware(),
	depositScene.middleware()
)

initActions(bot)
initCommands(bot)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
