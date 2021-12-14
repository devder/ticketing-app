import { Subjects, Publisher, OrderCancelledEvent } from "@devder-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
