// npm run test
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
  var signin: () => string[];
}

// mock fake import the nats-wrapper
jest.mock("../nats-wrapper");

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
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload. {id, email}
  const payload = { id: new mongoose.Types.ObjectId().toHexString(), email: "test@example.com" };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object. {jwt: MY_JWT}
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return string as cookie
  return [`express:sess=${base64}`];
};
