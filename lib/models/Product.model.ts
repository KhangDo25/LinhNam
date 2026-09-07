import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  realm: 'Sơn Hải' | 'Thủy Phủ' | 'Thiên Giới' | 'U Minh';
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả'],
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá'],
    min: [0, 'Giá không được âm'],
  },
  images: [String],
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  realm: {
    type: String,
    enum: ['Sơn Hải', 'Thủy Phủ', 'Thiên Giới', 'U Minh'],
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);