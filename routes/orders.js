const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const EmailService = require('../utils/emailService');

// @route   POST /api/orders
// @desc    Create new order (supports guest checkout)
// @access  Public (but secures by creating/using user)
router.post('/', async (req, res) => {
  try {
    const {
      items: orderItems,
      shipping,
      payment,
      subtotal,
      tax,
      shippingCost,
      total,
      guest
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check stock availability
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    // Determine user (guest auto-create or use authenticated)
    let userId = null;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    const User = require('../models/User');
    if (!userId && guest && shipping?.email && shipping?.firstName) {
      const existing = await User.findOne({ email: shipping.email });
      if (existing) {
        userId = existing._id;
      } else {
        const tempPassword = crypto.randomBytes(8).toString('hex');
        const tempUser = new User({
          name: `${shipping.firstName} ${shipping.lastName || ''}`.trim(),
          email: shipping.email,
          phone: shipping.phone,
          password: tempPassword,
          temporaryPassword: true,
          address: {
            street: shipping.address?.street,
            city: shipping.address?.city,
            state: shipping.address?.state,
            zipCode: shipping.address?.zipCode,
            country: shipping.address?.country
          },
          addresses: [
            {
              label: 'Default',
              street: shipping.address?.street,
              city: shipping.address?.city,
              state: shipping.address?.state,
              zipCode: shipping.address?.zipCode,
              country: shipping.address?.country,
              isDefault: true
            }
          ]
        });
        const emailToken = tempUser.generateEmailVerificationToken();
        await tempUser.save();
        userId = tempUser._id;
        
        // Send verification email
        if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
          EmailService.sendVerificationEmail(tempUser.email, tempUser.name, emailToken);
        }
        
        // In production, send emailToken + link via email
        req._verificationEmailToken = (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your_sendgrid_api_key_here') ? emailToken : undefined;
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Create order document per schema
    const order = new Order({
      user: userId,
      items: orderItems.map(i => ({ product: i.product, quantity: i.quantity, price: i.price })),
      shippingAddress: {
        street: shipping?.address?.street,
        city: shipping?.address?.city,
        state: shipping?.address?.state,
        zipCode: shipping?.address?.zipCode,
        country: shipping?.address?.country
      },
      paymentInfo: {
        id: payment?.details?.transactionId || 'manual',
        status: 'completed'
      },
      paidAt: new Date(),
      subtotal: subtotal,
      tax: tax,
      shippingCost: shippingCost,
      totalAmount: total,
      status: 'processing',
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      statusHistory: [{ status: 'processing', date: new Date() }]
    });

    await order.save();

    // Update product stock
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({
      success: true,
      order,
      verification: req._verificationEmailToken
    });
    
    // Send order confirmation email
    if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
      const user = await User.findById(userId);
      EmailService.sendOrderConfirmation(
        user.email, 
        user.name, 
        order.orderNumber, 
        { totalAmount: order.totalAmount, status: order.status }
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/me
// @desc    Get logged in user orders
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to access this order' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to cancel this order' });
    }

    // Check if order can be cancelled
    if (order.status !== 'processing') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    // Update order status
    order.status = 'cancelled';
    await order.save();

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
