import mongoose from "mongoose";
import { Password } from "../services/password";

// an interface that describes the properties that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the properties a new user-model has
// (represents the entire document)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties
// that a created saved user record document has. (represents one single record)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  // to change the returned json document from mongodb
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedpassword = await Password.toHash(this.get("password"));
    this.set("password", hashedpassword);
  }
  done();
});

// add a custom function in to a model in mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
// the second generic type is what the model function is going to return

export { User };
