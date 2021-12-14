import { Subjects, Publisher, ExpirationComplete } from "@devder-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationComplete> {
  readonly subject = Subjects.ExpirationComplete;
}
