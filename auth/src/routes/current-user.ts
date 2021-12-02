import express, { Request, Response } from "express";
const router = express.Router();
import { currentUser } from "@devder-tickets/common";

router.get("/api/users/currentuser", currentUser, (req: Request, res: Response) => {
  res.json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
