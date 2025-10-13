// CompostManagement.jsx - Updated with proper data sharing
import { useState, useEffect } from 'react';
import { Button } from '../../../components/components/ui/Button';
import { Card } from '../../../components/components/ui/Card';
import { Search, BarChart3, RefreshCw } from 'lucide-react';
import { MdOutlinePeopleAlt } from "react-icons/md"; 
import CompostSection from './CompostSection';
import CompostHandlerSection from './CompostHandlerSection';
import WasteSection from './WasteSection';
import AnalyticsSection from './AnalyticsSection';
import { MdCompost } from "react-icons/md";
import { GiPlantWatering } from "react-icons/gi";

// Import your API functions
import { getAllCompost } from '../../../api/compostAPI';
import { getAllCompostHandlers } from '../../../api/compostHandler';
import { getAllWaste } from '../../../api/wasteAPI';

const CompostManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('compost');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State for all data - start with empty arrays, not mock data
  const [composts, setComposts] = useState([]);
  const [handlers, setHandlers] = useState([]);
  const [wastes, setWastes] = useState([]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Fetch data from all APIs in parallel
      const [compostResponse, handlersResponse, wasteResponse] = await Promise.all([
        getAllCompost(),
        getAllCompostHandlers(),
        getAllWaste()
      ]);
      
      // Set the actual data from APIs
      setComposts(compostResponse.data || []);
      setHandlers(handlersResponse.data || []);
      setWastes(wasteResponse.data || []);
    } catch (error) {
      console.error('Error fetching compost management data:', error);
      // Set empty arrays on error
      setComposts([]);
      setHandlers([]);
      setWastes([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
  };

  const tabs = [
    { value: 'compost', label: 'Compost', icon: <GiPlantWatering className="w-5 h-5 text-green-600" /> },
    { value: 'handlers', label: 'Handlers', icon: <MdOutlinePeopleAlt className="w-5 h-5 text-green-600" /> },
    { value: 'waste', label: 'Waste', icon: <MdCompost className="w-5 h-5 text-green-600" /> },
    { value: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-5 h-5 text-green-600" /> },
  ];

  if (loading) {
    return (
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading compost management data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Compost Management</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6 space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-6 py-2 text-lg font-medium border-b-4 w-full focus:outline-none 
              ${activeTab === tab.value
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-600 hover:text-green-600 hover:border-green-300'} 
              transition-colors duration-300 ease-in-out`} 
            onClick={() => setActiveTab(tab.value)}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon}
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md mb-6 z-10">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Conditional Rendering - Pass the real data and refresh function */}
      {activeTab === 'compost' && (
        <CompostSection 
          composts={composts} 
          setComposts={setComposts} 
          refreshData={fetchAllData}
        />
      )}
      {activeTab === 'handlers' && (
        <CompostHandlerSection 
          handlers={handlers} 
          setHandlers={setHandlers} 
          refreshData={fetchAllData}
        />
      )}
      {activeTab === 'waste' && (
        <WasteSection 
          wastes={wastes} 
          setWastes={setWastes} 
          refreshData={fetchAllData}
        />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsSection 
          composts={composts} 
          handlers={handlers} 
          wastes={wastes} 
          refreshData={fetchAllData}
        />
      )}
    </div>
  );
};

export default CompostManagement;