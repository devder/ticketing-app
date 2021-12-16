import { OrderStatus } from "@devder-tickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  // create a matching id of the order in the Orders service
  id: string;
  userId: string;
  version: number;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    price: attrs.price,
    userId: attrs.userId,
    version: attrs.version,
    status: attrs.status,
  });

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };
