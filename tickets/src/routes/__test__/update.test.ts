import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const id = new mongoose.Types.ObjectId().toHexString();

it("returns a 404 if the provided id doesn't exist", async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "kdfkf", price: 40 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app).put(`/api/tickets/${id}`).send({ title: "kdfkf", price: 40 }).expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "kdfkf", price: 40 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "yuka", price: 20 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: "kdfkf", price: 40 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({ title: "Yuka" }).expect(400);
});

it("updates the ticket, provided valid inputs", async () => {
  const cookie = global.signin();
  const title = "new title";
  const price = 35;

  const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: "kdfkf", price: 40 });
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({ title, price }).expect(200);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const title = "new title";
  const price = 35;

  const response = await request(app).post("/api/tickets").set("Cookie", cookie).send({ title: "kdfkf", price: 40 });
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({ title, price }).expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
