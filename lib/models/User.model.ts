import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  loginAttempts: number;
  lockUntil: Date | null;
  cart: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  orderHistory: mongoose.Types.ObjectId[];
  bookmarks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên'],
    minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
    maxlength: [60, 'Họ tên không được vượt quá 60 ký tự'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  bookmarks: [String],
}, {
  timestamps: true,
});
UserSchema.methods.isLocked = function(): boolean {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);