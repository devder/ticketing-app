import express, { Request, Response } from "express";
import { NotFoundError } from "@devder-tickets/common";
import { Ticket } from "../models/ticket";
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.json(ticket);
});

export { router as showTicketRouter };
