import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for fetching and managing analytics data
 * Handles loading states and error handling automatically
 */
export const useAnalytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch dashboard data
   */
  const fetchDashboard = async () => {
    try {
      console.log('🔍 useAnalytics: Fetching dashboard...');
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getDashboard();
      console.log('✅ useAnalytics: Received response:', response);
      
      // Handle different response formats
      const data = response?.data || response;
      console.log('📊 useAnalytics: Setting dashboard data:', data);
      
      setDashboardData(data);
    } catch (err) {
      const errorMessage = err?.message || err?.error || 'Failed to fetch dashboard data';
      console.error('❌ useAnalytics: Error:', errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch revenue data with optional filters
   */
  const fetchRevenue = async (filters = {}) => {
    try {
      console.log('💰 Fetching revenue with filters:', filters);
      const response = await analyticsAPI.getRevenue(filters);
      return response?.data || response;
    } catch (err) {
      console.error('❌ Revenue fetch error:', err);
      toast.error('Failed to fetch revenue data');
      throw err;
    }
  };

  /**
   * Fetch monthly sales data
   */
  const fetchMonthlySales = async (year = new Date().getFullYear()) => {
    try {
      console.log('📈 Fetching monthly sales for year:', year);
      const response = await analyticsAPI.getMonthlySales(year);
      return response?.data || response;
    } catch (err) {
      console.error('❌ Monthly sales fetch error:', err);
      toast.error('Failed to fetch monthly sales');
      throw err;
    }
  };

  /**
   * Fetch top customers
   */
  const fetchTopCustomers = async (limit = 5) => {
    try {
      console.log('👥 Fetching top customers, limit:', limit);
      const response = await analyticsAPI.getTopCustomers(limit);
      return response?.data || response;
    } catch (err) {
      console.error('❌ Top customers fetch error:', err);
      toast.error('Failed to fetch top customers');
      throw err;
    }
  };

  /**
   * Fetch sales by category
   */
  const fetchSalesByCategory = async () => {
    try {
      console.log('📊 Fetching category performance...');
      const response = await analyticsAPI.getSalesByCategory();
      return response?.data || response;
    } catch (err) {
      console.error('❌ Category sales fetch error:', err);
      toast.error('Failed to fetch category sales');
      throw err;
    }
  };

  /**
   * Fetch revenue growth
   */
  const fetchRevenueGrowth = async () => {
    try {
      console.log('📈 Fetching revenue growth...');
      const response = await analyticsAPI.getRevenueGrowth();
      return response?.data || response;
    } catch (err) {
      console.error('❌ Revenue growth fetch error:', err);
      toast.error('Failed to fetch revenue growth');
      throw err;
    }
  };

  /**
   * Refresh dashboard data manually
   */
  const refreshDashboard = () => {
    console.log('🔄 Refreshing dashboard...');
    fetchDashboard();
  };

  // Fetch dashboard on mount
  useEffect(() => {
    console.log('🎯 useAnalytics: Hook mounted, fetching initial data...');
    fetchDashboard();
  }, []);

  // Debug log state changes
  useEffect(() => {
    console.log('🔄 useAnalytics: State updated -', {
      hasData: !!dashboardData,
      loading,
      error,
      data: dashboardData
    });
  }, [dashboardData, loading, error]);

  return {
    dashboardData,
    loading,
    error,
    refreshDashboard,
    fetchRevenue,
    fetchMonthlySales,
    fetchTopCustomers,
    fetchSalesByCategory,
    fetchRevenueGrowth,
  };
};

export default useAnalytics;
