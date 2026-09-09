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
  balance: number; 
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  emailVerified: boolean;
  verificationCode: string | null;
  verificationCodeExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
 
  isLocked(): boolean;
  isVerificationCodeValid(code: string): boolean;
  generateVerificationCode(): string;
  clearVerificationCode(): void;
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
  
  balance: {
    type: Number,
    default: 100000, 
    min: 0,
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },
  district: {
    type: String,
    default: '',
    trim: true,
  },
  ward: {
    type: String,
    default: '',
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  verificationCodeExpires: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

UserSchema.methods.isLocked = function (this: any): boolean {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
};

UserSchema.methods.isVerificationCodeValid = function (this: any, code: string): boolean {
  if (!this.verificationCode || !this.verificationCodeExpires) return false;
  if (this.verificationCode !== code) return false;
  if (this.verificationCodeExpires < new Date()) return false;
  return true;
};

UserSchema.methods.generateVerificationCode = function (this: any): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  this.verificationCode = code;
  this.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
  return code;
};

UserSchema.methods.clearVerificationCode = function (this: any): void {
  this.verificationCode = null;
  this.verificationCodeExpires = null;
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);