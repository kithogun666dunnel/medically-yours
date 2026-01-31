export type DomainEvent = {
  _id: string
  type: string
}

export type ReactionHandler<T extends DomainEvent = DomainEvent> = {
  eventType: string
  handle(event: T): Promise<void>
}
