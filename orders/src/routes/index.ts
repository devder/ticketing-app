import express, { Request, Response } from "express";
import { requireAuth } from "@devder-tickets/common";
import { Order } from "../models/order";
const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const tickets = await Order.find({ userId: req.currentUser!.id }).populate("ticket");
  res.json(tickets);
});

export { router as indexOrderRouter };
