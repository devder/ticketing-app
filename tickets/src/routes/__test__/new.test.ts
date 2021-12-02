import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

// as long as there is a mock setup in the setup test file,
// when i try to import a real file, the mock version gets imported instead
// eg. the natsWrapper

it("has a route handle listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({});
  expect(response.statusCode).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "something",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "title",
    })
    .expect(400);
});

it("creates a ticket with valid input", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0); //to equal zero bc in the setup test file, we are clearing the database collection first

  const title = "ticket 1";
  const price = 20;
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({ title, price }).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1); //to equal one bc in the setup test file, we are clearing the database collection first
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "ticket 1";
  await request(app).post("/api/tickets").set("Cookie", global.signin()).send({ title, price: 20 }).expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
