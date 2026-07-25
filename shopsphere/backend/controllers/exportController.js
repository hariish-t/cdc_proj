const exportService = require('../services/exportService');
const analyticsService = require('../services/analyticsService');
const { asyncHandler } = require('../middleware/errorHandler');
const { BadRequestError } = require('../utils/errorTypes');

/**
 * Export Controller
 * Handles report generation and exports
 */
class ExportController {
  /**
   * Export orders to Excel
   * GET /export/orders/excel
   */
  exportOrdersToExcel = asyncHandler(async (req, res) => {
    const { startDate, endDate, status } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const workbook = await exportService.exportToExcel(filters);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=orders_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  });

  /**
   * Export orders to CSV
   * GET /export/orders/csv
   */
  exportOrdersToCSV = asyncHandler(async (req, res) => {
    const { startDate, endDate, status } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const csvContent = await exportService.exportToCSV(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=orders_${Date.now()}.csv`
    );

    res.send(csvContent);
  });

  /**
   * Export analytics summary to Excel
   * GET /export/analytics/excel
   */
  exportAnalyticsToExcel = asyncHandler(async (req, res) => {
    const analyticsData = await analyticsService.getDashboardData();
    const workbook = await exportService.exportAnalyticsSummary(analyticsData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analytics_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  });

  /**
   * Generic export endpoint with format selection
   * GET /export/orders
   */
  exportOrders = asyncHandler(async (req, res) => {
    const { format = 'excel', startDate, endDate, status } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    if (format === 'excel') {
      const workbook = await exportService.exportToExcel(filters);
      
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=orders_${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } else if (format === 'csv') {
      const csvContent = await exportService.exportToCSV(filters);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=orders_${Date.now()}.csv`
      );

      res.send(csvContent);
    } else {
      throw new BadRequestError('Invalid export format. Use "excel" or "csv"');
    }
  });
}

module.exports = new ExportController();
