import mongoose, { Schema, Document } from "mongoose";
export interface IProductOverride extends Document {
  productId: string;
  priceValue?: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
const ProductOverrideSchema = new Schema<IProductOverride>(
  {
    productId: { type: String, required: true, unique: true, index: true },
    priceValue: { type: Number, min: 0 },
    stock: { type: Number, default: -1, min: -1 },
  },
  { timestamps: true }
);

export default mongoose.models.ProductOverride ||
  mongoose.model<IProductOverride>("ProductOverride", ProductOverrideSchema);
