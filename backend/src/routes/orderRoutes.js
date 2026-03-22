import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = Router();
router.use(authenticate);

router.get('/', orderController.getMyOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

export default router;
