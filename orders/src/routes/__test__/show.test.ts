import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
  const user = global.signin();
  // create a ticket
  const ticket = Ticket.build({ title: "Show Ticket", price: 30, id: new mongoose.Types.ObjectId().toHexString() });

  await ticket.save();

  // make a request build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if the wrong user trys o fetched an order", async () => {
  const user = global.signin();
  // create a ticket
  const ticket = Ticket.build({ title: "Show Ticket", price: 30, id: new mongoose.Types.ObjectId().toHexString() });

  await ticket.save();

  // make a request build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to fetch the order
  await request(app).get(`/api/orders/${order.id}`).set("Cookie", global.signin()).send().expect(401);
});
