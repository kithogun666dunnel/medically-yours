import { ReactionDispatcher } from './dispatcher'
import { logCaseCreated } from './handlers/logCaseCreated'

export const reactionDispatcher = new ReactionDispatcher()

// register all handlers here
reactionDispatcher.register(logCaseCreated)
