import User from '../../models/user';
import Order from '../../models/order';
import Boom from 'boom';
import OrderSchema from './validations';
import { createRazorpayOrder } from '../../helpers/razorpay';

const Create = async (req, res, next) => {
  const input = req.body;
  const { error } = OrderSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;

  try {
    const order = new Order({
      user: user_id,
      customerInfo: input.customerInfo,
      items: input.items,
      paymentMethod: input.paymentMethod,
      totalAmount: input.totalAmount,
    });

    const savedData = await order.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const CreateRazorpayOrder = async (req, res, next) => {
  const input = req.body;
  const { error } = OrderSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;

  try {
    // Create order first
    const order = new Order({
      user: user_id,
      customerInfo: input.customerInfo,
      items: input.items,
      paymentMethod: 'Razorpay',
      totalAmount: input.totalAmount,
    });

    const savedOrder = await order.save();

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      input.totalAmount,
      'INR', // You can make this configurable
      `order_${savedOrder._id}`
    );
    
    // Update order with razorpay order ID
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    res.json({
      order: savedOrder,
      razorpayOrderId: razorpayOrder.id,
      razorpayOrder: razorpayOrder,
    });
  } catch (e) {
    next(e);
  }
};

const UpdatePaymentStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { paymentId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return next(Boom.notFound('Order not found'));
    }

    if (status === 'success') {
      order.paymentStatus = 'Paid';
      order.orderStatus = 'Processing';
      order.razorpayPaymentId = paymentId;
    } else {
      order.paymentStatus = 'Failed';
    }

    await order.save();
    res.json(order);
  } catch (e) {
    next(e);
  }
};

const List = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', '-password -__v').populate('items.product');

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

const GetMyOrders = async (req, res, next) => {
  const { user_id } = req.payload;

  try {
    const orders = await Order.find({ user: user_id }).populate('items.product');

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

const GetOrderById = async (req, res, next) => {
  const { orderId } = req.params;
  const { user_id } = req.payload;

  try {
    const order = await Order.findOne({ _id: orderId, user: user_id }).populate('items.product');
    
    if (!order) {
      return next(Boom.notFound('Order not found'));
    }

    res.json(order);
  } catch (e) {
    next(e);
  }
};

export default {
  Create,
  CreateRazorpayOrder,
  UpdatePaymentStatus,
  List,
  GetMyOrders,
  GetOrderById,
};
