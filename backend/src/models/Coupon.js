import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrder: { type: Number, min: 0 },
  maxUses: { type: Number, min: 0 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date },
  validTo: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

couponSchema.index({ code: 1 });

export default mongoose.model('Coupon', couponSchema);
