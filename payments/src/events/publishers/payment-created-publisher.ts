import { Publisher, Subjects, PaymentCreatedEvent } from "@devder-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
