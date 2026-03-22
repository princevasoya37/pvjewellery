import { Router } from 'express';
import * as productController from '../controllers/productController.js';

const router = Router();

router.get('/', productController.list);
router.get('/categories', productController.getCategories);
router.get('/collections', productController.getCollections);
router.get('/:slug', productController.getBySlug);

export default router;
