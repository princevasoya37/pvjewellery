import Order from '../models/Order.js';
import Product from '../models/Product.js';
import * as paymentService from '../services/paymentService.js';
import crypto from 'crypto';

export async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    let subtotal = 0;
    const orderItems = [];

    // Validate products and calculate subtotal
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || '',
      });
    }

    // Default shipping and discount for now
    const discount = 0;
    const shippingCost = subtotal > 1000 ? 0 : 50;
    const total = subtotal + shippingCost - discount;

    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // Create Stripe Payment Intent
    const paymentIntent = await paymentService.createPaymentIntent(total, 'usd', {
      orderNumber,
      userId: req.userId,
    });

    const order = new Order({
      orderNumber,
      user: req.userId,
      items: orderItems,
      subtotal,
      shippingCost,
      discount,
      total,
      shippingAddress,
      paymentId: paymentIntent.id,
      paymentStatus: 'pending',
    });

    await order.save();

    return res.status(201).json({
      orderId: order._id,
      orderNumber,
      total,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ message: 'Failed to create order' });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load order' });
  }
}

