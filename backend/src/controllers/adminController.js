import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import * as adminProductService from '../services/adminProductService.js';
import { upload } from '../middleware/uploadLocal.js';

export async function getDashboardStats(req, res) {
  try {
    const [orderStats, products, users] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Refunded'] } } },
        { $group: { _id: null, totalSales: { $sum: '$total' }, count: { $sum: 1 }, avgOrderValue: { $avg: '$total' } } },
      ]).then((r) => r[0] || { totalSales: 0, count: 0, avgOrderValue: 0 }),
      Product.countDocuments(),
      User.countDocuments(),
    ]);
    return res.json({
      orders: orderStats.count,
      products,
      users,
      totalSales: orderStats.totalSales,
      avgOrderValue: Math.round((orderStats.avgOrderValue || 0) * 100) / 100,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
}

// ——— Upload image (single) ———
export function uploadImageMiddleware() {
  return upload.single('image');
}

export async function uploadImage(req, res) {
  try {
    if (!req.file || !req.file.filename) return res.status(400).json({ message: 'No image file' });
    // Return relative path so frontend can use proxy or prepend API origin
    const relativePath = `/uploads/products/${req.file.filename}`;
    const base = process.env.API_BASE_URL || process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${base.replace(/\/$/, '')}${relativePath}`;
    return res.json({ url: relativePath, fullUrl, filename: req.file.filename });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Upload failed' });
  }
}

// ——— Products ———
export async function listProducts(req, res) {
  try {
    const result = await adminProductService.adminListProducts(req.query);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await adminProductService.adminGetProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
}

export async function createProduct(req, res) {
  try {
    const diamondErrors = adminProductService.validateDiamondAttributes(req.body, false);
    if (diamondErrors.length) return res.status(400).json({ message: 'Validation failed', errors: diamondErrors });
    const product = await adminProductService.adminCreateProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })) });
    }
    return res.status(500).json({ message: err.message || 'Failed to create product' });
  }
}

export async function updateProduct(req, res) {
  try {
    const diamondErrors = adminProductService.validateDiamondAttributes(req.body, true);
    if (diamondErrors.length) return res.status(400).json({ message: 'Validation failed', errors: diamondErrors });
    const product = await adminProductService.adminUpdateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', errors: Object.values(err.errors).map((e) => ({ field: e.path, message: e.message })) });
    }
    return res.status(500).json({ message: err.message || 'Failed to update product' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await adminProductService.adminDeleteProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product' });
  }
}

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if ((c === ',' && !inQuotes) || c === '\n' || c === '\r') {
      out.push(cur.trim());
      cur = '';
      if (c !== ',') break;
    } else cur += c;
  }
  if (cur !== '' || inQuotes) out.push(cur.trim());
  return out;
}

function csvToProducts(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row = {};
    headers.forEach((h, j) => { row[h] = values[j] !== undefined ? values[j] : ''; });
    rows.push(row);
  }
  return { headers, rows };
}

function mapCsvRowToProduct(row, categoryIdMap, collectionIdMap) {
  const num = (v) => (v === '' || v == null ? undefined : Number(v));
  const str = (v) => (v === '' || v == null ? undefined : String(v).trim());
  const categoryId = row.categoryid || row.category_id || (row.category && categoryIdMap?.[row.category]);
  const collectionId = row.collectionid || row.collection_id || (row.collection && collectionIdMap?.[row.collection]);
  return {
    name: str(row.name) || 'Unnamed',
    description: str(row.description),
    type: row.type === 'jewellery' ? 'jewellery' : 'diamond',
    category: categoryId || undefined,
    collection: collectionId || undefined,
    images: row.images ? String(row.images).split('|').map((s) => s.trim()).filter(Boolean) : [],
    price: num(row.price) ?? 0,
    compareAtPrice: num(row.compareatprice) ?? num(row.compare_at_price),
    sku: str(row.sku),
    stock: num(row.stock) ?? 0,
    isActive: row.isactive !== 'false' && row.isactive !== '0',
    cut: str(row.cut),
    color: str(row.color),
    clarity: str(row.clarity),
    carat: num(row.carat),
    shape: str(row.shape),
    metal: str(row.metal),
    certifications: row.certifications ? String(row.certifications).split('|').map((s) => s.trim()).filter(Boolean) : [],
  };
}

export async function bulkCreateProducts(req, res) {
  try {
    const csvText = req.body.csv || req.body.data || '';
    if (!csvText.trim()) return res.status(400).json({ message: 'CSV data is required' });
    const { rows } = csvToProducts(csvText);
    if (!rows.length) return res.status(400).json({ message: 'No rows to import' });
    const categories = await Category.find().lean();
    const categoryIdMap = {};
    categories.forEach((c) => { categoryIdMap[c.name] = c._id; categoryIdMap[c.slug] = c._id; });
    const Collection = (await import('../models/Collection.js')).default;
    const collections = await Collection.find().lean();
    const collectionIdMap = {};
    collections.forEach((c) => { collectionIdMap[c.name] = c._id; collectionIdMap[c.slug] = c._id; });
    const productsToInsert = rows.map((row) => mapCsvRowToProduct(row, categoryIdMap, collectionIdMap));
    const result = await adminProductService.adminBulkCreateProducts(productsToInsert);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Bulk import failed' });
  }
}

// ——— Categories ———
export async function listCategories(req, res) {
  try {
    const list = await Category.find().sort({ order: 1, name: 1 }).lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

export async function createCategory(req, res) {
  try {
    const category = new Category(req.body);
    await category.save();
    return res.status(201).json(category.toObject());
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Category with this name/slug already exists' });
    return res.status(500).json({ message: err.message || 'Failed to create category' });
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json(category);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to update category' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete category' });
  }
}

// ——— Orders ———
export async function listOrders(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const status = req.query.status;
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
        .populate('user', 'email firstName lastName').lean(),
      Order.countDocuments(filter),
    ]);
    return res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'email firstName lastName').populate('items.product', 'name slug images').lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status, trackingNumber } = req.body;
    const update = {};
    if (status) update.status = status;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to update order' });
  }
}

// ——— Coupons ———
export async function listCoupons(req, res) {
  try {
    const list = await Coupon.find().sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch coupons' });
  }
}

export async function createCoupon(req, res) {
  try {
    if (req.body.code) req.body.code = String(req.body.code).toUpperCase().trim();
    const coupon = new Coupon(req.body);
    await coupon.save();
    return res.status(201).json(coupon.toObject());
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' });
    return res.status(500).json({ message: err.message || 'Failed to create coupon' });
  }
}

export async function updateCoupon(req, res) {
  try {
    if (req.body.code) req.body.code = String(req.body.code).toUpperCase().trim();
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json(coupon);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to update coupon' });
  }
}

export async function deleteCoupon(req, res) {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete coupon' });
  }
}

// ——— Users ———
export async function listUsers(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const [items, total] = await Promise.all([
      User.find().select('-passwordHash -refreshToken -emailVerifyToken -resetPasswordToken').sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(),
    ]);
    return res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
}
