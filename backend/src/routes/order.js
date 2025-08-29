import express from 'express';
const router = express.Router();

import Order from '../controllers/order';

router.post('/', Order.Create);
router.post('/razorpay', Order.CreateRazorpayOrder);
router.put('/:orderId/payment-status', Order.UpdatePaymentStatus);
router.get('/', Order.List);
router.get('/my-orders', Order.GetMyOrders);
router.get('/:orderId', Order.GetOrderById);

export default router;
