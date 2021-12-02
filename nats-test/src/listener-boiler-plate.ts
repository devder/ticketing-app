import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

// client
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), { url: "http://localhost:4222" });

stan.on("connect", function () {
  console.log("Listener connected to NATS");

  // prevent NATS from reconnecting when trying to shutdown
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // here, we add options by chaining them
  // setmanualackmode to true stops the default behavior of receiving events and automatically acknowledging them
  // irrespective of whether an error occurs while processing the recieved data.
  // when manuaclackmode is set, if there's no acknowledgement in 30s(default ackwait time), nats tries to send the event
  // to another service in the queue group till it gets an acknowledgement
  // setDeliverAllAvailable sends a list of all events that have ever taken place
  // setDurableName makes setDeliverAllAvailable deliver all only the first time when the receiving service comes up
  // the queue group name is also important so that when the Listener briefly goes down, we don't redeliver all
  // but rather deliver the ones that have not been marked as processed
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounts-service");
  // second argument to subsciption is queue group name
  // a queue group is made so that multiple instances of the same service will not receive the exact same event
  // for example two orders services subscribed to the same event
  const subscription = stan.subscribe("ticket:created", "orders-service-queue-group", options);

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(data);
      console.log(`Received event #${msg.getSequence()}, with data: ${JSON.parse(data)}`);
    }

    msg.ack();
  });
});

// intercept terminate or interrupt commands
process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});
