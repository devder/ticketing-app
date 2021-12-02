import request from "supertest";
// supertest is the tool that will help us fake a request to the express app
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  await request(app).post("/api/users/signup").send({ email: "test@example.com", password: "password" }).expect(201);
  const response = await request(app).post("/api/users/signout").send({}).expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
