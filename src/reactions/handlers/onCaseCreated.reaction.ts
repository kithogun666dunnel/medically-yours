import { DomainEvent, ReactionHandler } from "../reaction.types";

export const onCaseCreated: ReactionHandler<DomainEvent> = {
  eventType: "CASE_CREATED",

  async handle(event: DomainEvent): Promise<void> {
    console.log("[Reaction] CASE_CREATED received:", event._id);
  },
};
