import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// we write this interface to tell TS the kind of obj we expect back from jwt verify
interface UserPayload {
  id: string;
  email: string;
}

// augment the definition of what a request object should be optionally
// this how we reach into an exisiting type def and make a modification to it by adding an extra property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  // check if user is logged in
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    // set the payload on the request obj so that other route handlers can figure out who the user is
    req.currentUser = payload;
  } catch (error) {}

  next();
};
