const ExcelJS = require('exceljs');
const Order = require('../models/Order');
const { ORDER_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Export Service
 * Generate reports in Excel and CSV formats
 */
class ExportService {
  /**
   * Export orders to Excel
   */
  async exportToExcel(filters = {}) {
    try {
      const orders = await Order.find(filters)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      // Create workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Orders Report');

      // Define columns
      worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 20 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Customer Name', key: 'customerName', width: 25 },
        { header: 'Customer Email', key: 'customerEmail', width: 30 },
        { header: 'Product', key: 'product', width: 30 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Unit Price', key: 'unitPrice', width: 12 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Tax', key: 'tax', width: 12 },
        { header: 'Discount', key: 'discount', width: 12 },
        { header: 'Total Amount', key: 'totalAmount', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Payment Method', key: 'paymentMethod', width: 15 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

      // Add data rows
      orders.forEach(order => {
        const row = worksheet.addRow({
          orderId: order.orderId,
          date: new Date(order.createdAt).toLocaleDateString(),
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          product: order.product.name,
          category: order.product.category,
          quantity: order.product.quantity,
          unitPrice: order.product.unitPrice,
          amount: order.amount,
          tax: order.tax,
          discount: order.discount,
          totalAmount: order.totalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod
        });

        // Color code by status
        if (order.status === ORDER_STATUS.COMPLETED) {
          row.getCell('status').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC6EFCE' }
          };
        } else if (order.status === ORDER_STATUS.CANCELLED) {
          row.getCell('status').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFC7CE' }
          };
        }
      });

      // Add summary row
      const summaryRowIndex = worksheet.rowCount + 2;
      worksheet.getCell(`A${summaryRowIndex}`).value = 'TOTAL';
      worksheet.getCell(`A${summaryRowIndex}`).font = { bold: true };

      const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      worksheet.getCell(`L${summaryRowIndex}`).value = totalAmount;
      worksheet.getCell(`L${summaryRowIndex}`).font = { bold: true };
      worksheet.getCell(`L${summaryRowIndex}`).numFmt = '₹#,##0.00';

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.alignment = { vertical: 'middle' };
      });

      // Number formatting for currency columns
      ['H', 'I', 'J', 'K', 'L'].forEach(col => {
        worksheet.getColumn(col).numFmt = '₹#,##0.00';
      });

      logger.info(`Excel export generated: ${orders.length} orders`);
      return workbook;
    } catch (error) {
      logger.error('Excel export error:', error);
      throw error;
    }
  }

  /**
   * Export orders to CSV
   */
  async exportToCSV(filters = {}) {
    try {
      const orders = await Order.find(filters)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      // Create CSV content
      const headers = [
        'Order ID',
        'Date',
        'Customer Name',
        'Customer Email',
        'Product',
        'Category',
        'Quantity',
        'Unit Price',
        'Amount',
        'Tax',
        'Discount',
        'Total Amount',
        'Status',
        'Payment Method'
      ];

      const rows = orders.map(order => [
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.customerName,
        order.customerEmail,
        order.product.name,
        order.product.category,
        order.product.quantity,
        order.product.unitPrice,
        order.amount,
        order.tax,
        order.discount,
        order.totalAmount,
        order.status,
        order.paymentMethod
      ]);

      // Convert to CSV string
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      logger.info(`CSV export generated: ${orders.length} orders`);
      return csvContent;
    } catch (error) {
      logger.error('CSV export error:', error);
      throw error;
    }
  }

  /**
   * Export analytics summary to Excel
   */
  async exportAnalyticsSummary(analyticsData) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Analytics Summary');

      // Title
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').value = 'ShopSphere Analytics Report';
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      // Date
      worksheet.mergeCells('A2:D2');
      worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleString()}`;
      worksheet.getCell('A2').alignment = { horizontal: 'center' };

      // Revenue Summary
      let currentRow = 4;
      worksheet.getCell(`A${currentRow}`).value = 'Revenue Summary';
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      currentRow += 2;

      const revenueData = [
        ['Total Revenue', `₹${analyticsData.revenue.totalRevenue.toLocaleString()}`],
        ['Total Orders', analyticsData.revenue.totalOrders],
        ['Average Order Value', `₹${analyticsData.revenue.avgOrderValue.toLocaleString()}`]
      ];

      revenueData.forEach(([label, value]) => {
        worksheet.getCell(`A${currentRow}`).value = label;
        worksheet.getCell(`B${currentRow}`).value = value;
        currentRow++;
      });

      // Top Customers
      currentRow += 2;
      worksheet.getCell(`A${currentRow}`).value = 'Top 5 Customers';
      worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 };
      currentRow += 2;

      worksheet.getCell(`A${currentRow}`).value = 'Customer';
      worksheet.getCell(`B${currentRow}`).value = 'Email';
      worksheet.getCell(`C${currentRow}`).value = 'Total Spent';
      worksheet.getCell(`D${currentRow}`).value = 'Orders';
      worksheet.getRow(currentRow).font = { bold: true };
      currentRow++;

      analyticsData.topCustomers.forEach(customer => {
        worksheet.getCell(`A${currentRow}`).value = customer.name;
        worksheet.getCell(`B${currentRow}`).value = customer.email;
        worksheet.getCell(`C${currentRow}`).value = `₹${customer.totalSpent.toLocaleString()}`;
        worksheet.getCell(`D${currentRow}`).value = customer.orderCount;
        currentRow++;
      });

      // Column widths
      worksheet.getColumn('A').width = 25;
      worksheet.getColumn('B').width = 30;
      worksheet.getColumn('C').width = 20;
      worksheet.getColumn('D').width = 15;

      logger.info('Analytics summary export generated');
      return workbook;
    } catch (error) {
      logger.error('Analytics export error:', error);
      throw error;
    }
  }
}

module.exports = new ExportService();
