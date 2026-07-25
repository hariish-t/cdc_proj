/**
 * Application Constants
 * Centralized configuration values
 */

module.exports = {
  // User Roles
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    VIEWER: 'viewer'
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // Product Categories
  CATEGORIES: {
    ELECTRONICS: 'Electronics',
    FASHION: 'Fashion',
    HOME: 'Home & Kitchen',
    SPORTS: 'Sports',
    BOOKS: 'Books',
    BEAUTY: 'Beauty',
    TOYS: 'Toys',
    FOOD: 'Food & Beverages'
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // Socket Events
  SOCKET_EVENTS: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    NEW_ORDER: 'new-order',
    ORDER_UPDATE: 'order-update',
    ANALYTICS_UPDATE: 'analytics-update',
    USER_ACTIVITY: 'user-activity'
  },

  // JWT
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  },

  // Audit Actions
  AUDIT_ACTIONS: {
    LOGIN: 'login',
    LOGOUT: 'logout',
    CREATE_ORDER: 'create_order',
    UPDATE_ORDER: 'update_order',
    DELETE_ORDER: 'delete_order',
    EXPORT_DATA: 'export_data',
    VIEW_ANALYTICS: 'view_analytics'
  },

  // Rate Limiting
  RATE_LIMITS: {
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 5 // 5 login attempts
    },
    API: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100
    }
  },

  // Export Types
  EXPORT_FORMATS: {
    PDF: 'pdf',
    EXCEL: 'excel',
    CSV: 'csv'
  },

  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'DD MMM YYYY',
    API: 'YYYY-MM-DD',
    DATETIME: 'YYYY-MM-DD HH:mm:ss'
  },

  // Currency
  CURRENCY: {
    SYMBOL: '₹',
    CODE: 'INR'
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    AMOUNT_MIN: 0,
    AMOUNT_MAX: 1000000
  }
};
