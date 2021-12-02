import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@devder-tickets/common";

const app = express();
app.set("trust proxy", true);
// above line is to allow express know it is behind nginx ingress proxy
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }));
// secure:true means that cookies are only going to be shared over https connections

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// when using the async keyword in express, you need to resolve the promise with next
// but the express-async-lib helps us avoid that
// app.all("*", async (req, res, next) => {
//   next(new NotFoundError());
// });

app.use(errorHandler);

export { app };
