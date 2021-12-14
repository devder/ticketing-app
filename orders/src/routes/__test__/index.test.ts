import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

async function buildTicket(price: number) {
  const ticket = Ticket.build({
    title: "Concert",
    price,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();
  return ticket;
}

it("fetches orders for a particular user", async () => {
  // create three tickets
  const price = 20;
  const ticketOne = await buildTicket(price + 5);
  const ticketTwo = await buildTicket(price + 15);
  const ticketThree = await buildTicket(price + 25);

  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order as user number 1
  await request(app).post("/api/orders").set("Cookie", userOne).send({ ticketId: ticketOne.id }).expect(201);

  // create two orders as user number 2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders for user number 2
  const response = await request(app).get("/api/orders").set("Cookie", userTwo).send().expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);

  // make sure we only get orders for user number 2
});
