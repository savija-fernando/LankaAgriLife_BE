import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/components/ui/Card';
import { Button } from '../../../components/components/ui/Button';
import { Download, BarChart3, PieChart, TrendingUp, Calendar, Users, Package, Trash2, RefreshCw } from 'lucide-react';

const AnalyticsSection = ({ composts, handlers, wastes, refreshData }) => {
  const [timeRange, setTimeRange] = useState('all');
  const [reportType, setReportType] = useState('summary');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate analytics data with proper error handling
  const calculateAnalytics = () => {
    // Ensure we have arrays to work with
    const safeComposts = Array.isArray(composts) ? composts : [];
    const safeWastes = Array.isArray(wastes) ? wastes : [];
    const safeHandlers = Array.isArray(handlers) ? handlers : [];

    const totalCompost = safeComposts.reduce((sum, c) => sum + (parseInt(c.quantity) || 0), 0);
    const totalWaste = safeWastes.reduce((sum, w) => sum + (parseInt(w.quantity) || 0), 0);
    const totalHandlers = safeHandlers.length;
    
    // Status distribution
    const statusCounts = safeComposts.reduce((acc, c) => {
      const status = c.compostStatus || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Waste type distribution
    const wasteTypeCounts = safeWastes.reduce((acc, w) => {
      const type = w.type || 'Unknown';
      acc[type] = (acc[type] || 0) + (parseInt(w.quantity) || 0);
      return acc;
    }, {});

    // Monthly trends with proper date handling
    const monthlyCompost = safeComposts.reduce((acc, c) => {
      if (c.fermentingDate) {
        try {
          const date = new Date(c.fermentingDate);
          if (!isNaN(date.getTime())) {
            const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + (parseInt(c.quantity) || 0);
          }
        } catch (error) {
          console.warn('Invalid date format:', c.fermentingDate);
        }
      }
      return acc;
    }, {});

    // Handler performance (average compost per handler)
    const handlerPerformance = safeHandlers.map(handler => {
      const handlerComposts = safeComposts.filter(c => c.employee_id === handler.CompostHandler_id);
      const totalHandlerCompost = handlerComposts.reduce((sum, c) => sum + (parseInt(c.quantity) || 0), 0);
      return {
        name: `${handler.f_name} ${handler.l_name}`,
        compostCount: handlerComposts.length,
        totalCompost: totalHandlerCompost,
        efficiency: totalHandlerCompost > 0 ? (totalHandlerCompost / handlerComposts.length).toFixed(1) : 0
      };
    });

    // Calculate efficiency safely
    const compostEfficiency = totalWaste > 0 ? ((totalCompost / totalWaste) * 100).toFixed(1) : '0.0';
    const avgCompostPerHandler = totalHandlers > 0 ? (totalCompost / totalHandlers).toFixed(1) : '0.0';

    return {
      totalCompost,
      totalWaste,
      totalHandlers,
      statusCounts,
      wasteTypeCounts,
      monthlyCompost,
      handlerPerformance,
      compostEfficiency,
      avgCompostPerHandler,
      totalBatches: safeComposts.length,
      totalWasteRecords: safeWastes.length
    };
  };

  const analytics = calculateAnalytics();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generate PDF Report
  const generateReport = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compost Management Analytics Report</title>
        <style>
          @media print {
            @page { margin: 1cm; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .header { 
              text-align: center; 
              margin-bottom: 2cm;
              border-bottom: 2px solid #2e7d32;
              padding-bottom: 0.5cm;
            }
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 0.5cm; 
              margin-bottom: 1cm;
            }
            .summary-card { 
              border: 1px solid #ddd; 
              padding: 0.5cm; 
              border-radius: 0.3cm;
              background: #f9f9f9;
            }
            .section { 
              margin: 1cm 0; 
              page-break-inside: avoid;
            }
            .section-title { 
              background: #2e7d32; 
              color: white; 
              padding: 0.3cm; 
              margin-bottom: 0.5cm;
              border-radius: 0.2cm;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 0.5cm;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 0.3cm; 
              text-align: left;
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold;
            }
            .footer {
              margin-top: 2cm;
              text-align: center;
              font-size: 0.8em;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 0.5cm;
            }
            h1 { margin: 0; font-size: 24px; color: #2e7d32; }
            h2 { margin: 0; font-size: 20px; }
            h3 { margin: 0; font-size: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Compost Management Analytics Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Time Range: ${timeRange === 'all' ? 'All Time' : 'Last ' + timeRange}</p>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <strong>Total Compost Produced:</strong> ${analytics.totalCompost} kg<br>
            <small>Across ${analytics.totalBatches} batches</small>
          </div>
          <div class="summary-card">
            <strong>Total Waste Processed:</strong> ${analytics.totalWaste} kg<br>
            <small>${analytics.totalWasteRecords} waste records</small>
          </div>
          <div class="summary-card">
            <strong>Active Handlers:</strong> ${analytics.totalHandlers}<br>
            <small>Managing compost operations</small>
          </div>
          <div class="summary-card">
            <strong>Compost Efficiency:</strong> ${analytics.compostEfficiency}%<br>
            <small>Waste to compost conversion rate</small>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Compost Status Distribution</div>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Batch Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(analytics.statusCounts).map(([status, count]) => `
                <tr>
                  <td>${status}</td>
                  <td>${count}</td>
                  <td>${analytics.totalBatches > 0 ? ((count / analytics.totalBatches) * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">Waste Type Analysis</div>
          <table>
            <thead>
              <tr>
                <th>Waste Type</th>
                <th>Total Quantity (kg)</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(analytics.wasteTypeCounts).map(([type, quantity]) => `
                <tr>
                  <td>${type}</td>
                  <td>${quantity}</td>
                  <td>${analytics.totalWaste > 0 ? ((quantity / analytics.totalWaste) * 100).toFixed(1) : 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${Object.keys(analytics.monthlyCompost).length > 0 ? `
        <div class="section">
          <div class="section-title">Monthly Compost Production</div>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Compost Produced (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(analytics.monthlyCompost).map(([month, quantity]) => `
                <tr>
                  <td>${month}</td>
                  <td>${quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${analytics.handlerPerformance.length > 0 ? `
        <div class="section">
          <div class="section-title">Handler Performance</div>
          <table>
            <thead>
              <tr>
                <th>Handler Name</th>
                <th>Batches Managed</th>
                <th>Total Compost (kg)</th>
                <th>Avg per Batch</th>
              </tr>
            </thead>
            <tbody>
              ${analytics.handlerPerformance.map(handler => `
                <tr>
                  <td>${handler.name}</td>
                  <td>${handler.compostCount}</td>
                  <td>${handler.totalCompost}</td>
                  <td>${handler.efficiency}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <p>Compost Management System Analytics Report • Generated automatically</p>
          <p>Total Records: ${analytics.totalBatches} compost batches, ${analytics.totalWasteRecords} waste records, ${analytics.totalHandlers} handlers</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  // Generate Quick Summary Report
  const generateQuickReport = () => {
    const quickContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Compost Management Quick Report</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 2cm;
            line-height: 1.4;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 1cm;
            border-bottom: 2px solid #2e7d32;
            padding-bottom: 0.5cm;
          }
          .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 0.5cm; 
            margin: 1cm 0;
          }
          .stat-card { 
            background: #f5f5f5; 
            padding: 0.5cm; 
            border-radius: 0.3cm;
            text-align: center;
          }
          .footer {
            margin-top: 2cm;
            text-align: center;
            font-style: italic;
            color: #666;
          }
          @media print {
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Compost Management Quick Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Compost</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 0.2cm 0;">${analytics.totalCompost} kg</p>
            <small>${analytics.totalBatches} batches</small>
          </div>
          <div class="stat-card">
            <h3>Total Waste</h3>
            <p style="font-size: 24px; font-weight: bold; color: #d32f2f; margin: 0.2cm 0;">${analytics.totalWaste} kg</p>
            <small>${analytics.totalWasteRecords} records</small>
          </div>
          <div class="stat-card">
            <h3>Active Handlers</h3>
            <p style="font-size: 24px; font-weight: bold; color: #1976d2; margin: 0.2cm 0;">${analytics.totalHandlers}</p>
            <small>Managing operations</small>
          </div>
          <div class="stat-card">
            <h3>Efficiency</h3>
            <p style="font-size: 24px; font-weight: bold; color: #ed6c02; margin: 0.2cm 0;">${analytics.compostEfficiency}%</p>
            <small>Conversion rate</small>
          </div>
        </div>

        <div style="margin: 1cm 0;">
          <h3>Top Compost Status</h3>
          <ul>
            ${Object.entries(analytics.statusCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([status, count]) => `<li>${status}: ${count} batches</li>`)
              .join('')}
          </ul>
        </div>

        <div class="footer">
          <p>End of quick report - Compost Management System</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(quickContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Show empty state if no data
  if (analytics.totalBatches === 0 && analytics.totalWasteRecords === 0 && analytics.totalHandlers === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500 mb-4">Add some compost, waste, or handler data to see analytics.</p>
        <Button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-green-600 text-white mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-green-600" />
          Analytics & Reports
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-gray-600 text-white hover:bg-gray-500 rounded-full px-4 py-2"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            onClick={generateQuickReport}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-2"
          >
            <Download className="w-5 h-5" />
            Quick Report
          </Button>
          <Button
            onClick={generateReport}
            className="flex items-center gap-2 bg-green-700 text-white hover:bg-green-600 rounded-full px-4 py-2"
          >
            <Download className="w-5 h-5" />
            Full Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Time</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>

        <select 
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="summary">Summary</option>
          <option value="detailed">Detailed Analysis</option>
          <option value="trends">Trend Analysis</option>
        </select>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Compost Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Compost</p>
              <p className="text-3xl font-bold text-green-700 mt-2">{analytics.totalCompost} kg</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.totalBatches} batches</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Total Waste Card */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-100 p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Waste</p>
              <p className="text-3xl font-bold text-red-700 mt-2">{analytics.totalWaste} kg</p>
              <p className="text-xs text-gray-500 mt-1">{analytics.totalWasteRecords} records</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Handlers Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Handlers</p>
              <p className="text-3xl font-bold text-blue-700 mt-2">{analytics.totalHandlers}</p>
              <p className="text-xs text-gray-500 mt-1">Managing operations</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        {/* Efficiency Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Efficiency Rate</p>
              <p className="text-3xl font-bold text-orange-700 mt-2">{analytics.compostEfficiency}%</p>
              <p className="text-xs text-gray-500 mt-1">Waste to compost</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compost Status Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Compost Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{status}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.totalBatches) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {((count / analytics.totalBatches) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold text-gray-800 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Waste Type Analysis */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Waste Type Analysis
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.wasteTypeCounts).map(([type, quantity]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(quantity / analytics.totalWaste) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">
                    {((quantity / analytics.totalWaste) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold text-gray-800 w-12 text-right">
                    {quantity} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trends */}
      {Object.keys(analytics.monthlyCompost).length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Monthly Compost Production Trends
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.monthlyCompost)
              .sort(([monthA], [monthB]) => new Date(monthA) - new Date(monthB))
              .map(([month, quantity]) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-24">{month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full" 
                      style={{ 
                        width: `${(quantity / Math.max(...Object.values(analytics.monthlyCompost))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 w-16 text-right">
                  {quantity} kg
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Handler Performance */}
      {analytics.handlerPerformance.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Handler Performance
          </h3>
          <div className="space-y-4">
            {analytics.handlerPerformance
              .filter(handler => handler.compostCount > 0)
              .sort((a, b) => b.totalCompost - a.totalCompost)
              .map((handler, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{handler.name}</span>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{handler.compostCount} batches</span>
                    <span>Avg: {handler.efficiency} kg/batch</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(handler.totalCompost / Math.max(...analytics.handlerPerformance.map(h => h.totalCompost))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800 w-16 text-right">
                    {handler.totalCompost} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsSection;