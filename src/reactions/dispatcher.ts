import { DomainEvent, ReactionHandler } from './reaction.types'

export class ReactionDispatcher {
  private handlers: ReactionHandler[] = []

  register(handler: ReactionHandler) {
    this.handlers.push(handler)
  }

  async dispatch(event: DomainEvent): Promise<void> {
    for (const handler of this.handlers) {
      if (handler.eventType === event.type) {
        await handler.handle(event)
      }
    }
  }
}
