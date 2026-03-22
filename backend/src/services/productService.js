import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function buildProductFilter(query) {
  const filter = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.type) filter.type = query.type;
  if (query.cut) filter.cut = query.cut;
  if (query.color) filter.color = query.color;
  if (query.clarity) filter.clarity = query.clarity;
  if (query.shape) filter.shape = new RegExp(query.shape, 'i');
  if (query.metal) filter.metal = new RegExp(query.metal, 'i');
  if (query.minPrice != null || query.maxPrice != null) {
    filter.price = {};
    if (query.minPrice != null) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice != null) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.caratMin != null || query.caratMax != null) {
    filter.carat = {};
    if (query.caratMin != null) filter.carat.$gte = Number(query.caratMin);
    if (query.caratMax != null) filter.carat.$lte = Number(query.caratMax);
  }
  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  if (query.search) {
    filter.$or = [
      { name: new RegExp(query.search, 'i') },
      { description: new RegExp(query.search, 'i') },
      { sku: new RegExp(query.search, 'i') },
    ];
  }
  return filter;
}

export function buildSort(query) {
  const sortMap = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    newest: { createdAt: -1 },
    name: { name: 1 },
  };
  return sortMap[query.sort] || { createdAt: -1 };
}

export async function listProducts(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT));
  const filter = buildProductFilter(query);
  const sort = buildSort(query);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate('category', 'name slug').lean(),
    Product.countDocuments(filter),
  ]);
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .populate('collection', 'name slug')
    .lean();
  if (!product) return null;
  return product;
}

export async function getCategories() {
  return Category.find().sort({ order: 1, name: 1 }).lean();
}

export async function getCollections() {
  return Collection.find().sort({ order: 1, name: 1 }).lean();
}
