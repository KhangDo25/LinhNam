import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: null },
    balance: { type: Number, default: 150_000 },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);

export function toPublicUser(doc: UserDocument) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    emailVerified: doc.emailVerified,
    createdAt: doc.createdAt.toISOString(),
  };
}
