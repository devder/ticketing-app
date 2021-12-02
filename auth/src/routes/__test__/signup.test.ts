import request from "supertest";
// supertest is the tool that will help us fake a request to the express app
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  // use a post request as dfined in the original function, the params in the chained 'send' is the req body
  return request(app).post("/api/users/signup").send({ email: "test@example.com", password: "password" }).expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app).post("/api/users/signup").send({ email: "testexample.com", password: "password" }).expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app).post("/api/users/signup").send({ email: "test@example.com", password: "pad" }).expect(400);
});

it("returns a 400 with missing email n pword", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@test.com" }).expect(400);
  await request(app).post("/api/users/signup").send({ password: "password" }).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(201);
  await request(app).post("/api/users/signup").send({ email: "test@test.com", password: "password" }).expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
