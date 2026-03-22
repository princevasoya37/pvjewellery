import Product from '../models/Product.js';
import slugify from 'slugify';

const DIAMOND_ATTRS = ['cut', 'color', 'clarity', 'carat', 'shape'];

export function validateDiamondAttributes(body, isUpdate = false) {
  const errors = [];
  const type = body.type || (body.type === '' ? undefined : null);
  if (type === 'diamond') {
    for (const key of DIAMOND_ATTRS) {
      const val = body[key];
      if (val === undefined || val === null) continue;
      if (key === 'carat') {
        const n = Number(val);
        if (Number.isNaN(n) || n < 0) errors.push({ field: key, message: 'Carat must be a non-negative number' });
      } else if (typeof val !== 'string' || !val.trim()) {
        errors.push({ field: key, message: `${key} must be a non-empty string` });
      }
    }
  }
  return errors;
}

function ensureSlug(name, existingSlug) {
  if (existingSlug) return existingSlug;
  return slugify(name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
}

export async function adminListProducts(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const filter = {};
  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, 'i') },
      { sku: new RegExp(query.search, 'i') },
      { slug: new RegExp(query.search, 'i') },
    ];
  }
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit)
      .populate('category', 'name slug').populate('collection', 'name slug').lean(),
    Product.countDocuments(filter),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function adminGetProductById(id) {
  return Product.findById(id).populate('category', 'name slug').populate('collection', 'name slug').lean();
}

export async function adminCreateProduct(data) {
  data.slug = ensureSlug(data.name, data.slug);
  const product = new Product(data);
  await product.save();
  return product.toObject();
}

export async function adminUpdateProduct(id, data) {
  if (data.name && !data.slug) data.slug = ensureSlug(data.name, null);
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  ).populate('category', 'name slug').populate('collection', 'name slug').lean();
  return product;
}

export async function adminDeleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  return product;
}

export async function adminBulkCreateProducts(rows) {
  const results = { inserted: 0, errors: [] };
  for (let i = 0; i < rows.length; i++) {
    try {
      const row = rows[i];
      const slug = ensureSlug(row.name, row.slug);
      const doc = { ...row, slug };
      const product = new Product(doc);
      await product.save();
      results.inserted++;
    } catch (err) {
      results.errors.push({ row: i + 1, message: err.message });
    }
  }
  return results;
}
