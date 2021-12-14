import { Listener, OrderCreatedEvent, Subjects } from "@devder-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queuegroup-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      { delay }
    );

    // ack the message
    msg.ack();
  }
}
