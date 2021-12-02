import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Events {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Events> {
  private client: Stan;
  abstract subject: T["subject"];

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log("Event Published to", this.subject);
        resolve();
      });
    });
  }
}
