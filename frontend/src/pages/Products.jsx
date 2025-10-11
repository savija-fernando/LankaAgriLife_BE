// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAllHarvests } from "../api/harvestAPI";
import { getAllProduct } from "../api/productAPI";

// Import images
import carrot from "../assets/carrot.png";
import eggs from "../assets/eggs.png";
import compost from "../assets/compost.png";
import hay from "../assets/hay.png";
import bellPepper from "../assets/bellPepper.png";
import broccoli from "../assets/Broccoli.png";
import tomato from "../assets/tomato.png";
import lettuce from "../assets/letuce.png";
import rice from "../assets/Rice.jpg";
import chilli from "../assets/chilli.jpg";
import corn from "../assets/corn.jpg";
import potato from "../assets/potato.jpg";
import milk from "../assets/milk.jpg";
import cheese from "../assets/cheese.jpg";
import egg from "../assets/egg.jpg";

const productsData = [
  {
    name: "Premium Compost",
    image: compost,
    description: "Nutrient-dense compost made from farm waste.",
    available: 8,
    unit: "bags",
    status: "In Stock",
    tag: "Compost",
  },
];

const Products = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [harvests, setHarvests] = useState([]);
  const [dairyProducts, setDairyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [harvestsResponse, productsResponse] = await Promise.all([
        getAllHarvests(),
        getAllProduct()
      ]);
      setHarvests(harvestsResponse.data);
      setDairyProducts(productsResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get stock status based on quantity AND processing status
  function getStockStatus(quantity, processedStatus = null) {
    // If it's a dairy product and not processed, show as Out of Stock
    if (processedStatus && processedStatus.toLowerCase() === 'unprocessed') {
      return "Out of Stock";
    }
    
    const qty = parseInt(quantity) || 0;
    if (qty === 0) return "Out of Stock";
    if (qty < 5) return "Low Stock";
    return "In Stock";
  }

  // Convert harvests to product format for display
  const harvestProducts = harvests.map(harvest => ({
    name: harvest.type,
    image: getHarvestImage(harvest.type),
    description: harvest.note || `Freshly harvested ${harvest.type.toLowerCase()}`,
    available: parseInt(harvest.quantity) || 0,
    unit: "units",
    status: getStockStatus(harvest.quantity),
    tag: "Harvest",
    isHarvest: true,
    harvestDate: harvest.harvestDate,
    originalData: harvest
  }));

  // Convert dairy products to product format for display - now under "Products" tag
  const dairyProductItems = dairyProducts.map(product => ({
    name: product.type,
    image: getDairyImage(product.type),
    description: product.storageDetails || `Farm-fresh ${product.type.toLowerCase()}`,
    available: parseInt(product.quantity) || 0,
    unit: getDairyUnit(product.type),
    status: getStockStatus(product.quantity, product.processedStatus), // Pass processedStatus
    tag: "Products",
    isDairy: true,
    collectionDate: product.CollectionDate,
    processedStatus: product.processedStatus,
    originalData: product
  }));

  // Helper function to map harvest types to images
  function getHarvestImage(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('carrot')) return carrot;
    if (typeLower.includes('pepper')) return bellPepper;
    if (typeLower.includes('broccoli')) return broccoli;
    if (typeLower.includes('tomato')) return tomato;
    if (typeLower.includes('lettuce')) return lettuce;
    if (typeLower.includes('egg')) return eggs;
    if (typeLower.includes('rice')) return rice;
    if (typeLower.includes('chilli')) return chilli;
    if (typeLower.includes('corn')) return corn;
    if (typeLower.includes('potato')) return potato;
    return carrot;
  }

  // Helper function to map dairy types to images
  function getDairyImage(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('milk')) return milk;
    if (typeLower.includes('cheese')) return cheese;
    if (typeLower.includes('egg')) return egg;
    return milk; // default image
  }

  // Helper function to get appropriate units for dairy products
  function getDairyUnit(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('milk')) return 'liters';
    if (typeLower.includes('cheese')) return 'blocks';
    if (typeLower.includes('yogurt') || typeLower.includes('yoghurt')) return 'pots';
    if (typeLower.includes('egg')) return 'dozen';
    return 'units';
  }

  // Combine all products
  const allProducts = [...productsData, ...harvestProducts, ...dairyProductItems];

  // Filtering + searching
  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = filter === "All" || p.tag === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "availability") return b.available - a.available;
    if (sort === "status") return a.status.localeCompare(b.status);
    if (sort === "date" && a.isHarvest && b.isHarvest) {
      return new Date(b.harvestDate) - new Date(a.harvestDate);
    }
    if (sort === "date" && a.isDairy && b.isDairy) {
      return new Date(b.collectionDate) - new Date(a.collectionDate);
    }
    return 0;
  });

  // Statistics
  const totalHarvests = harvests.length;
  const totalDairyProducts = dairyProducts.length;
  const differentCrops = [...new Set(harvests.map(h => h.type))].length;
  const differentDairyTypes = [...new Set(dairyProducts.map(p => p.type))].length;
  const totalHarvested = harvests.reduce((sum, h) => sum + parseInt(h.quantity || 0), 0);
  const totalDairyQuantity = dairyProducts.reduce((sum, p) => sum + parseInt(p.quantity || 0), 0);

  // Count processed vs unprocessed dairy products
  const processedDairyCount = dairyProducts.filter(p => 
    p.processedStatus && p.processedStatus.toLowerCase() === 'processed'
  ).length;
  
  const unprocessedDairyCount = dairyProducts.filter(p => 
    p.processedStatus && p.processedStatus.toLowerCase() === 'unprocessed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navbar */}
      <Navbar />

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 pt-28">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Our Farm Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium selection of organic produce, farm-fresh goods, dairy products, and sustainable agricultural products
          </p>
          
          {/* Statistics */}
          {(harvests.length > 0 || dairyProducts.length > 0) && !loading && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-green-700">{totalHarvests}</div>
                <div className="text-sm text-gray-600">Current Harvests</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-blue-700">{totalDairyProducts}</div>
                <div className="text-sm text-gray-600">Dairy Products</div>
                <div className="text-xs text-gray-500 mt-1">
                  {processedDairyCount} processed • {unprocessedDairyCount} unprocessed
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-purple-700">
                  {differentCrops + differentDairyTypes}
                </div>
                <div className="text-sm text-gray-600">Product Varieties</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-orange-700">
                  {totalHarvested + totalDairyQuantity}
                </div>
                <div className="text-sm text-gray-600">Total Quantity</div>
              </div>
            </div>
          )}
        </div>

        {/* Search + Filters + Sort */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-12 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {["All", "Harvest", "Products", "Compost"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    filter === cat
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-green-500/25"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full lg:w-1/4">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm appearance-none"
              >
                <option value="name">Sort by Name (A–Z)</option>
                <option value="availability">Sort by Availability (High–Low)</option>
                <option value="status">Sort by Status</option>
                <option value="date">Sort by Collection Date</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product, index) => (
                  <div
                    key={product.isHarvest ? `harvest-${product.originalData.harvest_id}` : 
                         product.isDairy ? `dairy-${product.originalData.product_id}` : `product-${index}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                            product.status === "In Stock"
                              ? "bg-green-500 text-white"
                              : product.status === "Low Stock"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                      {/* Tag Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm shadow-lg ${
                          product.tag === "Harvest" ? "text-green-700" :
                          product.tag === "Compost" ? "text-brown-700" :
                          "text-gray-700"
                        }`}>
                          {product.tag}
                        </span>
                      </div>
                      {/* Date Badge */}
                      {(product.isHarvest || product.isDairy) && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black/70 text-white backdrop-blur-sm">
                            {product.isHarvest 
                              ? new Date(product.harvestDate).toLocaleDateString()
                              : new Date(product.collectionDate).toLocaleDateString()
                            }
                          </span>
                        </div>
                      )}
                      {/* Processing Status Badge for Unprocessed Products */}
                      {product.isDairy && product.processedStatus && product.processedStatus.toLowerCase() === 'unprocessed' && (
                        <div className="absolute top-12 right-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white shadow-lg">
                            Unprocessed
                          </span>
                        </div>
                      )}
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Availability Info */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">Availability:</span>
                          <span className={`text-sm font-bold ${
                            product.status === "In Stock" ? "text-green-600" : 
                            product.status === "Low Stock" ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {product.status === "Out of Stock" && product.isDairy && product.processedStatus?.toLowerCase() === 'unprocessed' 
                              ? "Not Available" 
                              : `${product.available} ${product.unit}`
                            }
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              product.status === "In Stock" ? "bg-green-500" : 
                              product.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ 
                              width: product.status === "Out of Stock" && product.isDairy && product.processedStatus?.toLowerCase() === 'unprocessed' 
                                ? "0%" 
                                : `${Math.min((product.available / 20) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Product-specific info */}
                      {product.isHarvest && (
                        <div className="mt-3 text-xs text-gray-500">
                          Freshly harvested • ID: {product.originalData.harvest_id}
                        </div>
                      )}
                      {product.isDairy && (
                        <div className="mt-3 text-xs text-gray-500">
                          {product.processedStatus} • ID: {product.originalData.product_id}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-gray-600 font-medium">
                  Showing {sortedProducts.length} of {allProducts.length} products
                  {harvests.length > 0 && ` (including ${harvests.length} harvests)`}
                  {dairyProducts.length > 0 && ` and ${dairyProducts.length} dairy products`}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;