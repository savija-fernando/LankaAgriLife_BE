import React, { useState, useEffect } from 'react';
import { Card } from '../../components/components/ui/Card';
import { Button } from '../../components/components/ui/Button';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  Leaf,
  Users,
  AlertTriangle,
  RefreshCw,
  Eye,
  TrendingDown
} from 'lucide-react';
import { 
  FaMoneyBillWave, 
  FaBoxes, 
  FaChartLine, 
  FaHeartbeat,
  FaCompass,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import API functions
import { getAllRevenue } from '../../api/revenueAPI';
import { getAllInventory } from '../../api/inventoryAPI';
import { getAllCompost } from '../../api/compostAPI';
import { getAllCompostHandlers } from '../../api/compostHandler';
import { getAllWaste } from '../../api/wasteAPI';

const Analytics = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [timeRange, setTimeRange] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Data states
  const [revenues, setRevenues] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [composts, setComposts] = useState([]);
  const [handlers, setHandlers] = useState([]);
  const [wastes, setWastes] = useState([]);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('Starting data fetch...');
      
      const [revenueRes, inventoryRes, compostRes, handlersRes, wasteRes] = await Promise.all([
        getAllRevenue().catch(err => {
          console.error('Revenue API error:', err);
          return { data: [] };
        }),
        getAllInventory().catch(err => {
          console.error('Inventory API error:', err);
          return { data: [] };
        }),
        getAllCompost().catch(err => {
          console.error('Compost API error:', err);
          return { data: [] };
        }),
        getAllCompostHandlers().catch(err => {
          console.error('Handlers API error:', err);
          return { data: [] };
        }),
        getAllWaste().catch(err => {
          console.error('Waste API error:', err);
          return { data: [] };
        })
      ]);

      console.log('API Responses:', {
        revenue: revenueRes?.data?.length || 0,
        inventory: inventoryRes?.data?.length || 0,
        compost: compostRes?.data?.length || 0,
        handlers: handlersRes?.data?.length || 0,
        waste: wasteRes?.data?.length || 0
      });

      setRevenues(revenueRes?.data || []);
      setInventory(inventoryRes?.data || []);
      setComposts(compostRes?.data || []);
      setHandlers(handlersRes?.data || []);
      setWastes(wasteRes?.data || []);
      setDataLoaded(true);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  // Revenue Calculations with safe defaults
  const totalSales = revenues?.reduce((acc, r) => acc + Number(r.salesData || 0), 0) || 0;
  const totalExpenses = revenues?.reduce((acc, r) => acc + Number(r.expenseData || 0), 0) || 0;
  const totalProfit = revenues?.reduce((acc, r) => acc + Number(r.profit || 0), 0) || 0;
  const businessHealth = totalProfit >= 0 ? 'Healthy' : 'Critical';
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;

  // Inventory Calculations
  const totalStock = inventory?.reduce((acc, inv) => acc + Number(inv.stockLevel || 0), 0) || 0;
  const lowStockItems = inventory?.filter(inv => Number(inv.stockLevel) <= Number(inv.threshold || 0)) || [];
  const highStockItems = inventory?.filter(inv => Number(inv.stockLevel) > 100) || [];
  const totalInventoryValue = inventory?.reduce((sum, item) => sum + ((item.stockLevel || 0) * (item.unitPrice || 0)), 0) || 0;

  // Compost Calculations
  const totalCompost = composts?.reduce((sum, c) => sum + (parseInt(c.quantity) || 0), 0) || 0;
  const totalWaste = wastes?.reduce((sum, w) => sum + (parseInt(w.quantity) || 0), 0) || 0;
  const compostEfficiency = totalWaste > 0 ? ((totalCompost / totalWaste) * 100).toFixed(1) : '0.0';

  // Performance indicators
  const performanceIndicators = {
    revenue: totalSales > 0 ? 'positive' : 'neutral',
    inventory: lowStockItems.length === 0 ? 'positive' : 'warning',
    compost: compostEfficiency > 50 ? 'positive' : 'neutral',
    overall: totalProfit >= 0 && lowStockItems.length === 0 ? 'positive' : 'warning'
  };

  // Generate Comprehensive PDF Report
  const generateComprehensiveReport = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();

    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Business Analytics Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 3px solid #059669;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #059669; 
            margin: 0;
            font-size: 32px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 20px;
            background: #f9fafb;
            text-align: center;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .metric-item {
            padding: 15px;
            border-radius: 8px;
            background: #f8fafc;
            border-left: 4px solid #059669;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Business Analytics Report</h1>
          <p>Generated on ${currentDate}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Revenue</h3>
            <p>Rs. ${totalSales.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Inventory Value</h3>
            <p>Rs. ${totalInventoryValue.toLocaleString()}</p>
          </div>
          <div class="summary-card">
            <h3>Compost Produced</h3>
            <p>${totalCompost} kg</p>
          </div>
        </div>

        <div class="section">
          <h2>Performance Summary</h2>
          <div class="metrics-grid">
            <div class="metric-item">
              <strong>Business Health:</strong> ${businessHealth}
            </div>
            <div class="metric-item">
              <strong>Profit Margin:</strong> ${profitMargin}%
            </div>
            <div class="metric-item">
              <strong>Low Stock Items:</strong> ${lowStockItems.length}
            </div>
            <div class="metric-item">
              <strong>Compost Efficiency:</strong> ${compostEfficiency}%
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Analytics Report | ${currentDate}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading comprehensive analytics...</p>
          <p className="text-gray-500 text-sm">Fetching data from all systems</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!dataLoaded || (revenues.length === 0 && inventory.length === 0 && composts.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Data Available</h2>
          <p className="text-gray-500 mb-6">
            Start adding data to your revenue, inventory, and compost systems to see analytics.
          </p>
          <Button
            onClick={handleRefresh}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check for Data
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    { value: 'overview', label: 'Overview', icon: <FaCompass className="w-5 h-5" /> },
    { value: 'revenue', label: 'Revenue', icon: <FaMoneyBillWave className="w-5 h-5" /> },
    { value: 'inventory', label: 'Inventory', icon: <FaBoxes className="w-5 h-5" /> },
    { value: 'compost', label: 'Compost', icon: <Leaf className="w-5 h-5" /> },
  ];

  // Reusable metric card component
  const MetricCard = ({ title, value, subtitle, color, icon, trend }) => (
    <Card className={`p-6 rounded-2xl shadow-lg border-l-4 ${color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 bg-opacity-20 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center mt-3 text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {trend === 'up' ? 'Positive' : 'Needs Attention'}
        </div>
      )}
    </Card>
  );

  // Data summary for debug
  const dataSummary = {
    revenue: revenues.length,
    inventory: inventory.length,
    compost: composts.length,
    waste: wastes.length,
    handlers: handlers.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Business Analytics</h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Comprehensive insights across all business operations
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-500 rounded-xl px-4 py-3"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button
                onClick={generateComprehensiveReport}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-500 rounded-xl px-6 py-3 shadow-lg"
              >
                <Download className="w-5 h-5" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Data Summary */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Revenue Records: <strong>{dataSummary.revenue}</strong></span>
              <span>Inventory Items: <strong>{dataSummary.inventory}</strong></span>
              <span>Compost Batches: <strong>{dataSummary.compost}</strong></span>
              <span>Waste Records: <strong>{dataSummary.waste}</strong></span>
              <span>Handlers: <strong>{dataSummary.handlers}</strong></span>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            {sections.map((section) => (
              <button
                key={section.value}
                onClick={() => setActiveSection(section.value)}
                className={`flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105
                  ${activeSection === section.value
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"}
                `}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Performance Status */}
            <Card className="p-6 rounded-2xl shadow-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Business Health Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${
                  performanceIndicators.revenue === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="font-semibold">Revenue</p>
                  <p className={performanceIndicators.revenue === 'positive' ? 'text-green-700' : 'text-yellow-700'}>
                    {performanceIndicators.revenue === 'positive' ? '✓ Healthy' : '● Needs Data'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  performanceIndicators.inventory === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="font-semibold">Inventory</p>
                  <p className={performanceIndicators.inventory === 'positive' ? 'text-green-700' : 'text-yellow-700'}>
                    {performanceIndicators.inventory === 'positive' ? '✓ Optimal' : '⚠ Low Stock'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  performanceIndicators.compost === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <p className="font-semibold">Sustainability</p>
                  <p className={performanceIndicators.compost === 'positive' ? 'text-green-700' : 'text-blue-700'}>
                    {performanceIndicators.compost === 'positive' ? '✓ Efficient' : '● Moderate'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  performanceIndicators.overall === 'positive' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <p className="font-semibold">Overall</p>
                  <p className={performanceIndicators.overall === 'positive' ? 'text-green-700' : 'text-yellow-700'}>
                    {performanceIndicators.overall === 'positive' ? '✓ Good' : '⚠ Review Needed'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value={`Rs.${totalSales.toLocaleString()}`}
                subtitle={`${revenues.length} records`}
                color="border-l-blue-500 bg-blue-50"
                icon={<DollarSign className="w-6 h-6 text-blue-600" />}
                trend={totalSales > 0 ? 'up' : null}
              />
              <MetricCard
                title="Inventory Value"
                value={`Rs.${totalInventoryValue.toLocaleString()}`}
                subtitle={`${inventory.length} items`}
                color="border-l-purple-500 bg-purple-50"
                icon={<Package className="w-6 h-6 text-purple-600" />}
                trend={totalInventoryValue > 0 ? 'up' : null}
              />
              <MetricCard
                title="Compost Produced"
                value={`${totalCompost} kg`}
                subtitle={`${composts.length} batches`}
                color="border-l-green-500 bg-green-50"
                icon={<Leaf className="w-6 h-6 text-green-600" />}
                trend={totalCompost > 0 ? 'up' : null}
              />
              <MetricCard
                title="Business Health"
                value={businessHealth}
                subtitle={`${profitMargin}% margin`}
                color={totalProfit >= 0 ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}
                icon={totalProfit >= 0 ? 
                  <FaHeartbeat className="w-6 h-6 text-green-600" /> : 
                  <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                }
                trend={totalProfit >= 0 ? 'up' : 'down'}
              />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Low Stock Alerts"
                value={lowStockItems.length}
                subtitle="Need attention"
                color="border-l-red-500 bg-red-50"
                icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
                trend={lowStockItems.length === 0 ? 'up' : 'down'}
              />
              <MetricCard
                title="Compost Efficiency"
                value={`${compostEfficiency}%`}
                subtitle="Waste conversion"
                color="border-l-orange-500 bg-orange-50"
                icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                trend={compostEfficiency > 50 ? 'up' : 'down'}
              />
              <MetricCard
                title="Active Handlers"
                value={handlers.length}
                subtitle="Compost management"
                color="border-l-cyan-500 bg-cyan-50"
                icon={<Users className="w-6 h-6 text-cyan-600" />}
                trend={handlers.length > 0 ? 'up' : null}
              />
            </div>
          </div>
        )}

        {/* Revenue Section */}
        {activeSection === 'revenue' && revenues.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Sales"
                value={`Rs.${totalSales.toLocaleString()}`}
                color="border-l-green-500 bg-green-50"
                icon={<DollarSign className="w-6 h-6 text-green-600" />}
              />
              <MetricCard
                title="Total Expenses"
                value={`Rs.${totalExpenses.toLocaleString()}`}
                color="border-l-red-500 bg-red-50"
                icon={<FaMoneyBillWave className="w-6 h-6 text-red-600" />}
              />
              <MetricCard
                title="Net Profit"
                value={`Rs.${totalProfit.toLocaleString()}`}
                color={totalProfit >= 0 ? "border-l-blue-500 bg-blue-50" : "border-l-red-500 bg-red-50"}
                icon={<FaChartLine className="w-6 h-6 text-blue-600" />}
              />
            </div>

            <Card className="p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-blue-700">{profitMargin}%</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sales/Expense Ratio</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {totalExpenses > 0 ? (totalSales / totalExpenses).toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Records Analyzed</p>
                  <p className="text-2xl font-bold text-orange-700">{revenues.length}</p>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Profit/Record</p>
                  <p className="text-2xl font-bold text-teal-700">
                    Rs.{revenues.length > 0 ? (totalProfit / revenues.length).toFixed(2) : '0'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Inventory Section */}
        {activeSection === 'inventory' && inventory.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Stock"
                value={`${totalStock.toLocaleString()} units`}
                color="border-l-blue-500 bg-blue-50"
                icon={<Package className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="Low Stock Items"
                value={lowStockItems.length}
                subtitle="Need attention"
                color="border-l-red-500 bg-red-50"
                icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
              />
              <MetricCard
                title="High Stock Items"
                value={highStockItems.length}
                color="border-l-green-500 bg-green-50"
                icon={<FaBoxes className="w-6 h-6 text-green-600" />}
              />
              <MetricCard
                title="Total Value"
                value={`Rs.${totalInventoryValue.toLocaleString()}`}
                color="border-l-purple-500 bg-purple-50"
                icon={<DollarSign className="w-6 h-6 text-purple-600" />}
              />
            </div>

            {/* Inventory Alerts */}
            {lowStockItems.length > 0 && (
              <Card className="p-6 rounded-2xl shadow-lg border border-red-200 bg-red-50">
                <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Low Stock Alerts
                </h3>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-medium text-gray-800">{item.itemName}</span>
                      <span className="text-red-600 font-semibold">
                        {item.stockLevel} units (Threshold: {item.threshold})
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Compost Section */}
        {activeSection === 'compost' && (composts.length > 0 || wastes.length > 0) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Compost Produced"
                value={`${totalCompost} kg`}
                subtitle={`${composts.length} batches`}
                color="border-l-green-500 bg-green-50"
                icon={<Leaf className="w-6 h-6 text-green-600" />}
              />
              <MetricCard
                title="Waste Processed"
                value={`${totalWaste} kg`}
                subtitle={`${wastes.length} records`}
                color="border-l-orange-500 bg-orange-50"
                icon={<Package className="w-6 h-6 text-orange-600" />}
              />
              <MetricCard
                title="Efficiency Rate"
                value={`${compostEfficiency}%`}
                subtitle="Waste to compost"
                color="border-l-blue-500 bg-blue-50"
                icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
              />
              <MetricCard
                title="Active Handlers"
                value={handlers.length}
                color="border-l-cyan-500 bg-cyan-50"
                icon={<Users className="w-6 h-6 text-cyan-600" />}
              />
            </div>
          </div>
        )}

        {/* Empty State for Sections */}
        {((activeSection === 'revenue' && revenues.length === 0) ||
          (activeSection === 'inventory' && inventory.length === 0) ||
          (activeSection === 'compost' && composts.length === 0 && wastes.length === 0)) && (
          <Card className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500 mb-4">
              No {activeSection} data found for the selected time range.
            </p>
            <Button
              onClick={handleRefresh}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;