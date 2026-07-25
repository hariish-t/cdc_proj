const mongoose = require('mongoose');

/**
 * Analytics Schema for caching dashboard metrics
 * This improves performance by storing pre-calculated values
 */
const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true
    },
    metrics: {
      totalRevenue: {
        type: Number,
        default: 0
      },
      totalOrders: {
        type: Number,
        default: 0
      },
      completedOrders: {
        type: Number,
        default: 0
      },
      pendingOrders: {
        type: Number,
        default: 0
      },
      cancelledOrders: {
        type: Number,
        default: 0
      },
      avgOrderValue: {
        type: Number,
        default: 0
      },
      uniqueCustomers: {
        type: Number,
        default: 0
      }
    },
    categories: [
      {
        name: String,
        revenue: Number,
        orderCount: Number
      }
    ],
    topProducts: [
      {
        name: String,
        category: String,
        orderCount: Number,
        revenue: Number
      }
    ],
    hourlyData: [
      {
        hour: { type: Number, min: 0, max: 23 },
        orderCount: Number,
        revenue: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

/**
 * Static method: Get or create analytics for date
 */
analyticsSchema.statics.getOrCreate = async function (date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  let analytics = await this.findOne({ date: startOfDay });

  if (!analytics) {
    analytics = new this({ date: startOfDay });
    await analytics.save();
  }

  return analytics;
};

/**
 * Static method: Update analytics for today
 */
analyticsSchema.statics.updateToday = async function (data) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await this.findOneAndUpdate(
    { date: today },
    { $set: data },
    { upsert: true, new: true }
  );
};

/**
 * Indexes for performance
 */
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
