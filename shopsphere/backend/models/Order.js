const mongoose = require('mongoose');
const { ORDER_STATUS, CATEGORIES } = require('../config/constants');

/**
 * Order Schema for E-commerce Analytics
 */
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true
    },
    product: {
      name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
      },
      category: {
        type: String,
        enum: Object.values(CATEGORIES),
        required: [true, 'Product category is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
      },
      unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price must be positive']
      }
    },
    amount: {
      type: Number,
      required: [true, 'Order amount is required'],
      min: [0, 'Amount must be positive']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax must be positive']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be positive']
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cash_on_delivery'],
      required: [true, 'Payment method is required']
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      zipCode: String
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    completedAt: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual: Calculate order age in days
 */
orderSchema.virtual('orderAge').get(function () {
  const ageInMs = Date.now() - this.createdAt;
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
});

/**
 * Virtual: Check if order is recent (within 24 hours)
 */
orderSchema.virtual('isRecent').get(function () {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return this.createdAt > oneDayAgo;
});

/**
 * Pre-save hook: Calculate total amount
 */
orderSchema.pre('save', function (next) {
  if (this.isModified('amount') || this.isModified('tax') || this.isModified('discount')) {
    this.totalAmount = this.amount + this.tax - this.discount;
  }
  next();
});

/**
 * Pre-save hook: Set completion/cancellation timestamps
 */
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === ORDER_STATUS.COMPLETED && !this.completedAt) {
      this.completedAt = new Date();
    }
    if (this.status === ORDER_STATUS.CANCELLED && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }
  next();
});

/**
 * Static method: Get total revenue
 */
orderSchema.statics.getTotalRevenue = async function (filter = {}) {
  const result = await this.aggregate([
    {
      $match: {
        status: ORDER_STATUS.COMPLETED,
        ...filter
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);

  return result[0] || { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
};

/**
 * Static method: Get monthly sales
 */
orderSchema.statics.getMonthlySales = async function (year) {
  return await this.aggregate([
    {
      $match: {
        status: ORDER_STATUS.COMPLETED,
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        totalSales: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.month': 1 }
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        totalSales: 1,
        orderCount: 1
      }
    }
  ]);
};

/**
 * Indexes for performance optimization
 */
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'product.category': 1 });
orderSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);
