import request from "supertest";
// supertest is the tool that will help us fake a request to the express app
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // const authResponse = await request(app)
  //   .post("/api/users/signup")
  //   .send({ email: "test@example.com", password: "password" })
  //   .expect(201);
  // const cookie = authResponse.get("Set-Cookie");
  const cookie = await global.signin();

  const response = await request(app).get("/api/users/currentuser").set("Cookie", cookie).send().expect(200);

  expect(response.body.currentUser.email).toEqual("test@example.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app).get("/api/users/currentuser").send({}).expect(200);

  expect(response.body.currentUser).toEqual(null);
});

const ctx = { request: { body: "" }, response: "", body: "" };

const response = ctx.request.body;

ctx.body = response;
