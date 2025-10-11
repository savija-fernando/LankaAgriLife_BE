// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getAllHarvests } from "../api/harvestAPI"; // Your existing API function

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

const productsData = [
 
  {
    name: "Farm Fresh Eggs",
    image: eggs,
    description: "Free-range chicken eggs rich in protein.",
    available: 12,
    unit: "dozen",
    status: "In Stock",
    tag: "Products",
  },
  {
    name: "Premium Compost",
    image: compost,
    description: "Nutrient-dense compost made from farm waste.",
    available: 8,
    unit: "bags",
    status: "In Stock",
    tag: "Compost",
  },
  {
    name: "Fresh Hay",
    image: hay,
    description: "High-quality hay for livestock and gardens.",
    available: 0,
    unit: "bales",
    status: "Out of Stock",
    tag: "Products",
  },
  {
    name: "Bell Peppers",
    image: bellPepper,
    description: "Fresh bell peppers with vibrant colors.",
    available: 15,
    unit: "lbs",
    status: "In Stock",
    tag: "Products",
  },
  {
    name: "Organic Broccoli",
    image: broccoli,
    description: "Crisp organic broccoli rich in nutrients.",
    available: 10,
    unit: "heads",
    status: "Low Stock",
    tag: "Products",
  },
  {
    name: "Vine Tomatoes",
    image: tomato,
    description: "Juicy vine-ripened organic tomatoes.",
    available: 7,
    unit: "lbs",
    status: "In Stock",
    tag: "Products",
  },
  {
    name: "Crisp Lettuce",
    image: lettuce,
    description: "Fresh lettuce heads perfect for salads.",
    available: 15,
    unit: "heads",
    status: "In Stock",
    tag: "Products",
  },
];

const Products = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch harvests on mount
  useEffect(() => {
    fetchHarvests();
  }, []);

  const fetchHarvests = async () => {
    try {
      const res = await getAllHarvests();
      setHarvests(res.data);
    } catch (error) {
      console.error("Failed to fetch harvests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert harvests to product format for display
  const harvestProducts = harvests.map(harvest => ({
    name: harvest.type,
    image: getHarvestImage(harvest.type), // Function to map harvest type to image
    description: harvest.note || `Freshly harvested ${harvest.type.toLowerCase()}`,
    available: parseInt(harvest.quantity) || 0,
    unit: "units",
    status: getStockStatus(harvest.quantity),
    tag: "Harvest",
    isHarvest: true, // Flag to identify harvest items
    harvestDate: harvest.harvestDate,
    originalData: harvest
  }));

  // Helper function to get stock status based on quantity
  function getStockStatus(quantity) {
    const qty = parseInt(quantity) || 0;
    if (qty === 0) return "Out of Stock";
    if (qty < 5) return "Low Stock";
    return "In Stock";
  }

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
    // Default image
    return carrot;
  }

  // Combine both products and harvests
  const allProducts = [...productsData, ...harvestProducts];

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
    return 0;
  });

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
            Discover our premium selection of organic produce, farm-fresh goods, and sustainable agricultural products
          </p>
          
          {/* Harvest Stats */}
          {harvests.length > 0 && !loading && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-green-700">{harvests.length}</div>
                <div className="text-sm text-gray-600">Current Harvests</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-green-700">
                  {[...new Set(harvests.map(h => h.type))].length}
                </div>
                <div className="text-sm text-gray-600">Different Crops</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-lg font-bold text-green-700">
                  {harvests.reduce((sum, h) => sum + parseInt(h.quantity || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Harvested</div>
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
                <option value="date">Sort by Harvest Date</option>
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
                    key={product.isHarvest ? `harvest-${product.originalData.harvest_id}` : `product-${index}`}
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
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-green-700 shadow-lg">
                          {product.tag}
                        </span>
                      </div>
                      {/* Harvest Date Badge */}
                      {product.isHarvest && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-black/70 text-white backdrop-blur-sm">
                            {new Date(product.harvestDate).toLocaleDateString()}
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
                            product.available > 10 ? "text-green-600" : 
                            product.available > 0 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {product.available} {product.unit}
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              product.available > 10 ? "bg-green-500" : 
                              product.available > 0 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ 
                              width: `${Math.min((product.available / 20) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Harvest-specific info */}
                      {product.isHarvest && (
                        <div className="mt-3 text-xs text-gray-500">
                          Freshly harvested • ID: {product.originalData.harvest_id}
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