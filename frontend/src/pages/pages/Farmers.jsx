import React, { useState, useEffect } from 'react';
import { getAllFarmers } from '../../api/farmerAPI';
import { getAllPlants } from '../../api/plantAPI';
import { User, Phone, Mail, ChevronDown, ChevronUp, Sprout, Users, Trees, Leaf } from 'lucide-react';

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [farmersResponse, plantsResponse] = await Promise.all([
        getAllFarmers(),
        getAllPlants()
      ]);
      setFarmers(farmersResponse.data);
      setPlants(plantsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFarmerPlants = (farmerId) => {
    return plants.filter(plant => plant.employee_id === farmerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-green-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-green-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Farm Managers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our dedicated farmers and explore the plants they nurture with care and expertise
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Farmers</p>
                <p className="text-3xl font-bold text-green-700 mt-2">{farmers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Farmers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {farmers.filter(farmer => getFarmerPlants(farmer.farmer_id).length > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Plants</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{plants.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Trees className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Plant Varieties</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {[...new Set(plants.map(p => p.type))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Farmers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {farmers.map((farmer) => {
            const farmerPlants = getFarmerPlants(farmer.farmer_id);
            const isSelected = selectedFarmer?.farmer_id === farmer.farmer_id;
            
            return (
              <div
                key={farmer.farmer_id}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform ${
                  isSelected ? 'ring-4 ring-green-500 scale-105' : 'hover:-translate-y-2'
                } border border-gray-100 cursor-pointer`}
                onClick={() => setSelectedFarmer(isSelected ? null : farmer)}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {farmer.f_name} {farmer.l_name}
                        </h3>
                        <p className="text-green-100 text-sm">ID: {farmer.farmer_id}</p>
                      </div>
                    </div>
                    <div className="text-white">
                      {isSelected ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    {farmer.email && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{farmer.email}</span>
                      </div>
                    )}
                    {farmer.contact_No && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{farmer.contact_No}</span>
                      </div>
                    )}
                    
                    {/* Plant Summary */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sprout className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-gray-700">Managed Plants</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          farmerPlants.length > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {farmerPlants.length}
                        </span>
                      </div>
                      {farmerPlants.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Click to view {farmerPlants.length} plant{farmerPlants.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Farmer Details */}
        {selectedFarmer && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedFarmer.f_name} {selectedFarmer.l_name}
                  </h2>
                  <p className="text-gray-600">Farmer ID: {selectedFarmer.farmer_id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Close Details
              </button>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {selectedFarmer.email && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
                      <p className="text-lg font-medium text-gray-800">{selectedFarmer.email}</p>
                    </div>
                  </div>
                </div>
              )}
              {selectedFarmer.contact_No && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Phone</p>
                      <p className="text-lg font-medium text-gray-800">{selectedFarmer.contact_No}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Managed Plants Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Managed Plants</h3>
                <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                  {getFarmerPlants(selectedFarmer.farmer_id).length}
                </span>
              </div>

              {getFarmerPlants(selectedFarmer.farmer_id).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFarmerPlants(selectedFarmer.farmer_id).map((plant, index) => (
                    <div
                      key={plant.crop_id}
                      className="group bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 border border-green-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-green-800 group-hover:text-green-700 transition-colors">
                          {plant.type}
                        </h4>
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                          {plant.crop_id}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Planted</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(plant.plantingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Harvested</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(plant.harvestDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Location</span>
                          <span className="font-semibold text-gray-800">{plant.location}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-green-100">
                          <span className="text-sm text-gray-600">Water Intake</span>
                          <span className="font-semibold text-blue-600">{plant.waterIntake} ml/day</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">Fertilizer</span>
                          <span className="font-semibold text-yellow-600">{plant.fertilizerIntake} g/week</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No Plants Assigned</h4>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    This farmer doesn't have any plants to manage yet. Assign plants to see them here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}