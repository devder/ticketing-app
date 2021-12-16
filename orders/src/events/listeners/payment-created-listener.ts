import { Message } from "node-nats-streaming";
import { Subjects, PaymentCreatedEvent, Listener, OrderStatus } from "@devder-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    // ideally we should emit an event to increment the version number
    // in other services but here once an order is complete that's the end

    msg.ack();
  }
}
