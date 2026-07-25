import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Activity, BarChart3, TrendingUp } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const SalesChart = ({ data, loading = false }) => {
  const [chartType, setChartType] = useState('area');
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('📈 SalesChart received data:', data);
  }, [data]);

  // Format data correctly from backend structure
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      console.log('⚠️ SalesChart: No data or invalid format');
      return [];
    }

    // Backend sends: [{ month: "Jan", sales: 0, orders: 0 }, ...]
    const formatted = data.map(item => ({
      name: item.month || 'Unknown',
      sales: Number(item.sales) || 0,
      orders: Number(item.orders) || 0
    }));

    console.log('📊 SalesChart formatted data:', formatted);
    return formatted;
  }, [data]);

  // Wait for DOM to be ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        console.log('✅ SalesChart container ready');
        setIsReady(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-[450px] w-full bg-white dark:bg-gray-800 rounded-lg p-8 animate-pulse border border-gray-200">
        <div className="h-6 w-48 bg-gray-200 rounded mb-8" />
        <div className="h-64 w-full bg-gray-100 rounded-lg" />
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {payload[0].payload.name}
        </p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400 capitalize">
              {item.name}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {item.name === 'sales' ? formatCurrency(item.value) : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sales Performance
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Revenue and order trends for 2026
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg gap-1">
          {[
            { id: 'area', icon: Activity, label: 'Area' },
            { id: 'bar', icon: BarChart3, label: 'Bar' },
            { id: 'line', icon: TrendingUp, label: 'Line' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setChartType(mode.id)}
              className={`p-2 px-3 rounded-md flex items-center gap-2 text-xs font-medium transition-all ${
                chartType === mode.id 
                  ? 'bg-white dark:bg-gray-700 shadow text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <mode.icon size={14} />
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full" style={{ height: '320px', minHeight: '320px' }}>
        {isReady && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  dy={5}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`}
                  dx={-5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  fill="url(#salesGradient)" 
                  name="sales"
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  fill="url(#ordersGradient)" 
                  name="orders"
                />
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} name="sales" />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={40} name="orders" />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6' }} 
                  activeDot={{ r: 6 }}
                  name="sales"
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#8b5cf6' }}
                  name="orders"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : !isReady ? (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-400 text-sm">Loading chart...</p>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <Activity className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm font-medium">No sales data available</p>
            <p className="text-gray-400 text-xs mt-1">Data will appear once orders are created</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SalesChart;
