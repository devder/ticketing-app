import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// client
// run kubectl port-forward nats-depl-75f94494f8-6lvn2 4222:4222 in the terminal
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // // we need to convert data to json
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "Something new",
  //   price: 50,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "12356",
      title: "From the generic class",
      price: 50,
    });
  } catch (e) {
    console.error(e);
  }
});
