import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@devder-tickets/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-pubisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  // publish event
  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(204).json(order);
});

export { router as deleteOrderRouter };
