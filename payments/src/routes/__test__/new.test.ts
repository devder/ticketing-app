import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId: new mongoose.Types.ObjectId().toHexString(), token: "eiuriueoiwe" })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 500,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId: order.id, token: "jennrker" })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 500,
    status: OrderStatus.Created,
    userId,
    version: 1,
  });

  order.set({ status: OrderStatus.Cancelled });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "rhkhrj" })
    .expect(400);
});

it("returns a 204 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 500,
    status: OrderStatus.Created,
    userId,
    version: 1,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "tok_visa" })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(stripe.charges.create).toHaveBeenCalled();

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(500 * 100);
  expect(chargeOptions.currency).toEqual("cad");

  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   // stripeId: stripeCharge.id,
  // });

  // expect(payment).not.toBeNull();
});
