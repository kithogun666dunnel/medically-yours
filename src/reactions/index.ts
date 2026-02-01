import { ReactionDispatcher } from './dispatcher'
import { logCaseCreated } from './handlers/onCaseClosed.reaction'

export const reactionDispatcher = new ReactionDispatcher()

// register all handlers here
reactionDispatcher.register(logCaseCreated)
