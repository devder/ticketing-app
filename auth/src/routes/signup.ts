import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@devder-tickets/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().isLength({ min: 4, max: 20 }).withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({ email, password });
    await user.save();

    // generate jsonwebtoken, store on the session object, add the ! at the end to tell TS we are sure it exists
    const userJWT = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
    req.session = { jwt: userJWT };

    res.status(201).json(user);
  }
);

export { router as signupRouter };
