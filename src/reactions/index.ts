import { ReactionDispatcher } from "./dispatcher";
import { logCaseCreated } from "./handlers/onCaseClosed.reaction";
import { onCaseCreated } from "./handlers/onCaseCreated.reaction";

export const reactionDispatcher = new ReactionDispatcher();

// register all handlers here
reactionDispatcher.register(logCaseCreated);
reactionDispatcher.register(onCaseCreated);
