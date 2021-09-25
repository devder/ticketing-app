import express, { Request, Response } from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = await Password.compare(exisitingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    const userJWT = jwt.sign({ id: exisitingUser.id, email: exisitingUser.email }, process.env.JWT_KEY!);
    req.session = { jwt: userJWT };
    res.status(201).json(exisitingUser);
  }
);

export { router as signinRouter };
