import { Publisher, Subjects, TicketUpdatedEvent } from "@devder-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
