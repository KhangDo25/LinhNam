export { default as User, default } from "./User.model";
export type { IUser as UserDocument } from "./User.model";
export function toPublicUser(doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    emailVerified: doc.emailVerified,
    createdAt: doc.createdAt.toISOString(),
  };
}


