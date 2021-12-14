import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async function () {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async function () {
  const ticket = Ticket.build({
    price: 40,
    title: "Soccer Ticket",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
    userId: "kjrioei",
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async function () {
  const ticket = Ticket.build({
    price: 40,
    title: "Soccer Ticket",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // const order = Order.build({
  //   expiresAt: new Date(),
  //   status: OrderStatus.Created,
  //   ticket,
  //   userId: "kjrioei",
  // });

  // await order.save();

  const response = await request(app).post("/api/orders").set("Cookie", global.signin()).send({
    ticketId: ticket.id,
  });

  // expect(response.statusCode).toEqual(400);
  expect(response.statusCode).toEqual(201);
});

it("emits a created event", async function () {
  const ticket = Ticket.build({
    price: 40,
    title: "Soccer Ticket",
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
