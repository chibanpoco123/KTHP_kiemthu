import Joi from 'joi';

const OrderSchema = Joi.object({
  customerInfo: Joi.object({
    fullName: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(10).max(15),
    shippingAddress: Joi.string().required().min(10).max(500),
  }).required(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).default(1),
      price: Joi.number().positive().required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid('COD', 'Razorpay', 'VNPay').required(),
  totalAmount: Joi.number().positive().required(),
});

export default OrderSchema;
