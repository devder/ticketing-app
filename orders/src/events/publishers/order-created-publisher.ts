import { Subjects, Publisher, OrderCreatedEvent } from "@devder-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
