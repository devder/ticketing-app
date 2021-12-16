import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@devder-tickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);
// above line is to allow express know it is behind nginx ingress proxy
app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }));
// secure:true means that cookies are only going to be shared over https connections

app.use(currentUser);
app.use(createChargeRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
