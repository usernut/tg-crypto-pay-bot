import { Scenes } from 'telegraf'
import { IContext } from '../common'

export interface IScene {
	create(): Scenes.Stage<IContext, Scenes.SceneSessionData>
}
