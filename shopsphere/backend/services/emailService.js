const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email Service
 * Send transactional emails (optional feature)
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  /**
   * Initialize email transporter
   */
  initialize() {
    // Only initialize if email credentials are provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      logger.info('Email service initialized');
    } else {
      logger.warn('Email service not configured (SMTP credentials missing)');
    }
  }

  /**
   * Send email
   */
  async sendEmail(to, subject, html, text = '') {
    if (!this.transporter) {
      logger.warn('Email service not configured, skipping email');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'ShopSphere <noreply@shopsphere.com>',
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId} to ${to}`);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4472C4;">Order Confirmation</h2>
        <p>Dear ${order.customerName},</p>
        <p>Thank you for your order! Your order has been confirmed.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>Product:</strong> ${order.product.name}</p>
          <p><strong>Quantity:</strong> ${order.product.quantity}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        </div>
        
        <p>You can track your order status in the dashboard.</p>
        <p>Thank you for shopping with ShopSphere!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `;

    return await this.sendEmail(
      order.customerEmail,
      `Order Confirmation - ${order.orderId}`,
      html
    );
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(order, newStatus) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4472C4;">Order Status Update</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order status has been updated.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <p><strong>Order ID:</strong> ${order.orderId}</p>
          <p><strong>New Status:</strong> <span style="color: #4472C4; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
        </div>
        
        <p>Thank you for shopping with ShopSphere!</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `;

    return await this.sendEmail(
      order.customerEmail,
      `Order Status Update - ${order.orderId}`,
      html
    );
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4472C4;">Welcome to ShopSphere!</h2>
        <p>Dear ${user.name},</p>
        <p>Welcome to ShopSphere Analytics Dashboard!</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px;">
          <h3 style="margin-top: 0;">Your Account Details</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> ${user.role.toUpperCase()}</p>
        </div>
        
        <p>You can now access the dashboard and start monitoring your business analytics.</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      'Welcome to ShopSphere Analytics',
      html
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4472C4;">Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>We received a request to reset your password.</p>
        
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #4472C4; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy this link: ${resetUrl}
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      'Password Reset Request - ShopSphere',
      html
    );
  }
}

module.exports = new EmailService();
