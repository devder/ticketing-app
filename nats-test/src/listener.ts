import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

// refer to boilerplate file for more information
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), { url: "http://localhost:4222" });

stan.on("connect", function () {
  console.log("Listener connected to NATS");
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
