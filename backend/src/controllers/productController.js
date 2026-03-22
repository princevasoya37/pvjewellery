import * as productService from '../services/productService.js';

export async function list(req, res) {
  try {
    const result = await productService.listProducts(req.query);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
}

export async function getBySlug(req, res) {
  try {
    const product = await productService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await productService.getCategories();
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

export async function getCollections(req, res) {
  try {
    const collections = await productService.getCollections();
    return res.json(collections);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch collections' });
  }
}
