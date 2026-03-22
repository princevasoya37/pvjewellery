import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['diamond', 'jewellery'],
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  sku: { type: String, sparse: true, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true },
  // 4Cs & diamond/jewellery attributes
  cut: { type: String, trim: true },
  color: { type: String, trim: true },
  clarity: { type: String, trim: true },
  carat: { type: Number, min: 0 },
  shape: { type: String, trim: true },
  metal: { type: String, trim: true },
  certifications: [{ type: String }],
  specs: { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
});

productSchema.index({ slug: 1 });
productSchema.index({ type: 1, isActive: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ cut: 1, color: 1, clarity: 1, carat: 1 });

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model('Product', productSchema);
