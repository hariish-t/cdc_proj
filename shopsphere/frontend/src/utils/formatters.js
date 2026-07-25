import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

/**
 * Format date in readable format
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy');
};

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
};

/**
 * Format date relative (e.g., "2 hours ago")
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, 'hh:mm a')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, 'hh:mm a')}`;
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format order status for display
 */
export const formatStatus = (status) => {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return statusMap[status] || status;
};

/**
 * Format payment method for display
 */
export const formatPaymentMethod = (method) => {
  const methodMap = {
    credit_card: 'Credit Card',
    debit_card: 'Debit Card',
    upi: 'UPI',
    net_banking: 'Net Banking',
    cash_on_delivery: 'Cash on Delivery',
  };
  return methodMap[method] || method;
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

/**
 * Truncate text
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random color for avatar
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const index = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[index];
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateTime,
  formatRelativeDate,
  formatPercent,
  formatStatus,
  formatPaymentMethod,
  getStatusColor,
  truncate,
  formatFileSize,
  getInitials,
  getAvatarColor,
};
