import mongoose from 'mongoose';
import slugify from 'slugify';

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true },
  image: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });


collectionSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Collection', collectionSchema);
