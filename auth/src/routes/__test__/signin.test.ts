import request from "supertest";
// supertest is the tool that will help us fake a request to the express app
import { app } from "../../app";

it("fails when an email that doesn't exist is supplied", async () => {
  await request(app).post("/api/users/signin").send({ email: "test@example.com", password: "password" }).expect(400);
});

it("fails when an incocrrect password is supplied", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@example.com", password: "password" }).expect(201);
  await request(app).post("/api/users/signin").send({ email: "test@example.com", password: "pas" }).expect(400);
});

it("responds with a cookie when given valid creds", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@example.com", password: "password" }).expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({ email: "test@example.com", password: "password" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
