import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();
router.use(authenticate, requireRole('admin'));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Upload (single image for product) – handle multer errors (file type, size)
router.post('/upload/image', (req, res, next) => {
  adminController.uploadImageMiddleware()(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Invalid file' });
    next();
  });
}, adminController.uploadImage);

// Products
router.get('/products', adminController.listProducts);
router.get('/products/:id', adminController.getProductById);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.post('/products/bulk', adminController.bulkCreateProducts);

// Categories
router.get('/categories', adminController.listCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Orders
router.get('/orders', adminController.listOrders);
router.get('/orders/:id', adminController.getOrderById);
router.patch('/orders/:id', adminController.updateOrderStatus);

// Coupons
router.get('/coupons', adminController.listCoupons);
router.post('/coupons', adminController.createCoupon);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Users
router.get('/users', adminController.listUsers);

export default router;
