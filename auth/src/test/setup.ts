// npm run test
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

// augment the definition of what a request object should be optionally
// this how we reach into an exisiting type def and make a modification to it by adding an extra property

// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// this is a hook function that runs before the test starts
beforeAll(async () => {
  process.env.JWT_KEY = "secret_key";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// this is a hook function that runs before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@example.com";
  const password = "password";

  const response = await request(app).post("/api/users/signup").send({ email, password }).expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
