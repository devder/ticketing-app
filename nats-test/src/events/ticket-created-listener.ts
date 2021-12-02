import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // readonly so that the value does not change later on, which is same as above
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event data: ", data);

    msg.ack();
  }
}
