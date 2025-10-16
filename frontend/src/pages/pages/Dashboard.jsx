import React, { useState, useEffect } from 'react';
import Card from "../../components/components/Card";
import RecentActivities from "../../components/components/RecentActivities";
import PerformanceCard from "../../components/components/PerformanceCard";
import WeatherCard from "../../components/WeatherWidget";
import { getAllRevenue } from "../../api/revenueAPI"; 
import { getAllInventory } from "../../api/inventoryAPI";

export default function Dashboard() {
  const [revenues, setRevenues] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [profitData, setProfitData] = useState({
    totalProfit: 0,
    businessHealth: 'Healthy',
    healthColor: 'text-green-600'
  });
  const [inventoryData, setInventoryData] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    lowStockAlerts: 0
  });
  
  // Notification state
  const [notificationCount, setNotificationCount] = useState(3);

  // Fetch revenue data and calculate profit
  const fetchRevenueData = async () => {
    try {
      const res = await getAllRevenue();
      const revenueData = res.data || [];
      setRevenues(revenueData);

      // Calculate profit metrics
      const totalProfit = revenueData.reduce((acc, r) => acc + Number(r.profit || 0), 0);
      const businessHealth = totalProfit >= 0 ? 'Healthy' : 'Critical';
      const healthColor = totalProfit >= 0 ? 'text-green-600' : 'text-red-600';

      setProfitData({
        totalProfit,
        businessHealth,
        healthColor
      });
    } catch (err) {
      console.error('Error fetching revenue data:', err);
    }
  };

  // Fetch inventory data and calculate metrics
  const fetchInventoryData = async () => {
    try {
      const res = await getAllInventory();
      const inventoryData = res.data || [];
      setInventory(inventoryData);

      // Calculate inventory metrics
      const totalItems = inventoryData.length;
      const lowStockItems = inventoryData.filter(item => item.stockLevel <= item.threshold).length;
      const totalValue = inventoryData.reduce((sum, item) => sum + (item.stockLevel * item.unitPrice), 0);
      const lowStockAlerts = lowStockItems;

      setInventoryData({
        totalItems,
        lowStockItems,
        totalValue,
        lowStockAlerts
      });

      // Update notification count based on low stock alerts
      const newNotificationCount = 3 + lowStockAlerts;
      setNotificationCount(newNotificationCount);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchInventoryData();
    
    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(() => {
      fetchRevenueData();
      fetchInventoryData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Format profit for display
  const formatProfit = (profit) => {
    return `Rs.${Math.abs(profit).toLocaleString()} ${profit < 0 ? 'Loss' : 'Profit'}`;
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return `Rs.${amount.toLocaleString()}`;
  };

  // Get profit trend indicator
  const getProfitTrend = (profit) => {
    return profit >= 0 ? 'up' : 'down';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50/70 p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-2 font-medium">Welcome back! Here's what's happening on your farm today.</p>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700 font-medium">Live updates active</span>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-1">
            <Card 
              title="Active Crops" 
              value="24" 
              sub="+3 from last month"
              className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl border-0"
              icon="🌱"
            />
          </div>
          <div className="transform hover:scale-105 transition-all duration-300 hover:-rotate-1">
            <Card 
              title="Compost Batches" 
              value="8" 
              sub="2 in progress"
              className="bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-2xl border-0"
              icon="🔄"
            />
          </div>
          <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-1">
            <Card 
              title="Livestock" 
              value="156" 
              sub="+12 this quarter"
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl border-0"
              icon="🐄"
            />
          </div>
          
          {/* Dynamic Profit Card */}
          <div className="transform hover:scale-105 transition-all duration-300 hover:-rotate-1">
            <Card 
              title="Current Profit" 
              value={formatProfit(profitData.totalProfit)} 
              sub={`Status: ${profitData.businessHealth}`}
              className={`bg-gradient-to-br ${
                profitData.totalProfit >= 0 
                  ? 'from-emerald-500 to-green-600' 
                  : 'from-rose-500 to-red-600'
              } text-white shadow-lg hover:shadow-2xl border-0`}
              icon={profitData.totalProfit >= 0 ? "💰" : "📉"}
            />
          </div>
        </div>

        {/* Middle Section with Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activities
                </h2>
                <button className="text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  View All Activities
                </button>
              </div>
              <RecentActivities />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Live Weather */}
            <WeatherCard />

            {/* Profit Health Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Profit Status</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  profitData.totalProfit >= 0 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {profitData.businessHealth}
                </span>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${profitData.healthColor} mb-2`}>
                    {formatProfit(profitData.totalProfit)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on {revenues.length} revenue entries
                  </div>
                </div>
                
                {/* Health Indicator */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      profitData.totalProfit >= 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}
                    style={{ 
                      width: `${Math.min(Math.abs(profitData.totalProfit) / 10000 * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                
                <div className="text-center text-sm text-gray-500 font-medium">
                  {profitData.totalProfit >= 0 ? '✅ Positive cash flow' : '⚠️ Review expenses needed'}
                </div>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Inventory Status</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  inventoryData.lowStockAlerts > 5 ? 'bg-red-100 text-red-700 border border-red-200' :
                  inventoryData.lowStockAlerts > 2 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {inventoryData.lowStockAlerts > 5 ? 'Critical' : 
                   inventoryData.lowStockAlerts > 2 ? 'Warning' : 'Good'}
                </span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{inventoryData.totalItems}</div>
                    <div className="text-xs text-gray-600 font-medium">Total Items</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-900">{inventoryData.lowStockItems}</div>
                    <div className="text-xs text-gray-600 font-medium">Low Stock</div>
                  </div>
                </div>
                
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {formatCurrency(inventoryData.totalValue)}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Total Inventory Value</div>
                </div>
                
                {/* Stock Level Indicator */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      inventoryData.lowStockAlerts > 5 ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                      inventoryData.lowStockAlerts > 2 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                      'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}
                    style={{ 
                      width: `${Math.max(100 - (inventoryData.lowStockItems / inventoryData.totalItems * 100), 10)}%` 
                    }}
                  ></div>
                </div>
                
                <div className="text-center text-sm text-gray-500 font-medium">
                  {inventoryData.lowStockAlerts > 0 ? 
                    `⚠️ ${inventoryData.lowStockAlerts} items need restocking` : 
                    '✅ All items well stocked'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-1">
            <PerformanceCard 
              title="Crop Yield" 
              value="92%" 
              sub="Of expected yield"
              trend="up"
              className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl hover:shadow-2xl border-0"
              icon="📈"
            />
          </div>
          <div className="transform hover:scale-105 transition-all duration-300 hover:-rotate-1">
            <PerformanceCard 
              title="Compost Quality" 
              value="85%" 
              sub="Quality rating"
              trend="up"
              className="bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl hover:shadow-2xl border-0"
              icon="⭐"
            />
          </div>
          
          {/* Dynamic Profit Margin Card */}
          <div className="transform hover:scale-105 transition-all duration-300 hover:rotate-1">
            <PerformanceCard 
              title="Profit Margin" 
              value={`${profitData.totalProfit >= 0 ? '+' : ''}${Math.round((profitData.totalProfit / Math.max(revenues.reduce((acc, r) => acc + Number(r.salesData || 0), 1)) * 100) || 0)}%`}
              sub="Current profit ratio"
              trend={getProfitTrend(profitData.totalProfit)}
              className={`bg-gradient-to-br ${
                profitData.totalProfit >= 0 
                  ? 'from-blue-500 to-indigo-600' 
                  : 'from-rose-500 to-red-600'
              } text-white shadow-xl hover:shadow-2xl border-0`}
              icon={profitData.totalProfit >= 0 ? "💹" : "📉"}
            />
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm px-3 py-1 rounded-full font-bold">
              {notificationCount} new alerts
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryData.lowStockAlerts > 0 && (
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-200 hover:shadow-md transition-all duration-300">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <span className="text-sm text-gray-700 font-medium block">
                    Low Stock Alert
                  </span>
                  <span className="text-xs text-gray-600">
                    {inventoryData.lowStockAlerts} items
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:shadow-md transition-all duration-300">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <span className="text-sm text-gray-700 font-medium block">Watering Schedule</span>
                <span className="text-xs text-gray-600">In 2 hours</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <span className="text-sm text-gray-700 font-medium block">Compost Ready</span>
                <span className="text-xs text-gray-600">Batch #5 for review</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <span className="text-sm text-gray-700 font-medium block">Maintenance Due</span>
                <span className="text-xs text-gray-600">Equipment check</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold">98%</div>
            <div className="text-sm opacity-90 font-medium mt-2">Soil Health Score</div>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm opacity-90 font-medium mt-2">Farm Monitoring</div>
          </div>
          <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-2xl p-6 text-white text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-3xl font-bold">15</div>
            <div className="text-sm opacity-90 font-medium mt-2">Active Workers</div>
          </div>
          
          {/* Business Health Card */}
          <div className={`rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
            profitData.totalProfit >= 0 
              ? 'bg-gradient-to-br from-lime-500 to-green-600 text-white' 
              : 'bg-gradient-to-br from-orange-500 to-red-600 text-white'
          }`}>
            <div className="text-3xl font-bold">{profitData.businessHealth}</div>
            <div className="text-sm opacity-90 font-medium mt-2">Business Health</div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}