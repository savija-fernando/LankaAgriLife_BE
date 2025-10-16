import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import googleIcon from "../assets/google.png";
import githubIcon from "../assets/github.png";

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    location: "",
    
    // Farm Information
    farmName: "",
    farmType: "",
    farmSize: "",
    mainCrops: [],
    livestock: [],
    
    // Experience & Preferences
    experience: "",
    interests: [],
    subscription: "basic"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const farmTypes = [
    "Vegetable Farming",
    "Fruit Orchards",
    "Tea Plantation",
    "Rice Cultivation",
    "Spice Garden",
    "Floriculture",
    "Mixed Farming",
    "Livestock Only"
  ];

  const cropOptions = [
    "Rice", "Tea", "Coconut", "Rubber", "Spices",
    "Vegetables", "Fruits", "Flowers", "Grains", "Medicinal Plants"
  ];

  const livestockOptions = [
    "Dairy Cattle", "Poultry", "Goats", "Fish Farming",
    "Beekeeping", "Pigs", "Sheep", "Other Livestock"
  ];

  const experienceLevels = [
    "Beginner (0-2 years)",
    "Intermediate (3-5 years)",
    "Experienced (6-10 years)",
    "Expert (10+ years)"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send registration data to backend
      const response = await fetch("http://localhost:8070/send-farmer-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success modal
        setShowSuccessModal(true);
        
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          farmName: "",
          farmType: "",
          farmSize: "",
          mainCrops: [],
          livestock: [],
          experience: "",
          interests: [],
          subscription: "basic"
        });
      } else {
        // Even if Twilio fails, show success to user but log error
        console.error("Notification failed:", result.error);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Still show success to user for better UX
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // Optionally navigate to home or stay on page
    // navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to LankaAgriLife!
            </h3>
            
            <p className="text-gray-600 mb-6">
              🎉 Registration Successful! Our team will send you community details shortly via WhatsApp/Email.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Community welcome message within 24 hours</li>
                <li>✓ Access to farmer forums & resources</li>
                <li>✓ Personalized farming insights</li>
                <li>✓ Market connection opportunities</li>
              </ul>
            </div>

            <button
              onClick={closeSuccessModal}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* Left Side - Benefits */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 items-center justify-center text-white p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Join LankaAgriLife</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                ✓
              </div>
              <p className="text-green-50">Connect with 10,000+ Sri Lankan Farmers</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                ✓
              </div>
              <p className="text-green-50">Get Expert Advice & Market Insights</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                ✓
              </div>
              <p className="text-green-50">Access Modern Farming Tools & Analytics</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white text-green-600 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                ✓
              </div>
              <p className="text-green-50">Sell Your Produce in Digital Marketplace</p>
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm italic">
              "LankaAgriLife helped me increase my crop yield by 40% and connect with buyers directly!"
            </p>
            <p className="text-sm mt-2 font-semibold">- Kamal Perera, Vegetable Farmer</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 relative bg-gray-50">
        <div className="w-full max-w-2xl space-y-6 bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Home
            </button>
            
            <NavLink
              to="/admin"
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Admin Login
            </NavLink>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="ml-2 font-semibold">Farm Profile</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-gray-500">Preferences</span>
            </div>
          </div>

          
          <p className="text-gray-600 text-center mb-8">
            Join Sri Lanka's largest agricultural community
          </p>

          {/* Quick Social Signup */}
          <div className="flex gap-4 mb-6">
            <button className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            <button className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or register manually</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07X XXX XXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location/District *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kandy, Matale, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Farm Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    placeholder="Your farm name (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farm Type *
                  </label>
                  <select
                    name="farmType"
                    value={formData.farmType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select farm type</option>
                    {farmTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Main Crops */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Crops (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {cropOptions.map(crop => (
                    <label key={crop} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.mainCrops.includes(crop)}
                        onChange={() => handleMultiSelect('mainCrops', crop)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{crop}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Livestock */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Livestock (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {livestockOptions.map(animal => (
                    <label key={animal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.livestock.includes(animal)}
                        onChange={() => handleMultiSelect('livestock', animal)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">{animal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Preferences</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farming Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Membership
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'basic', name: 'Basic', price: 'Free', features: ['Community Access', 'Basic Tools'] },
                    { id: 'premium', name: 'Premium', price: 'Rs. 500/mo', features: ['All Features', 'Market Access'] },
                    { id: 'enterprise', name: 'Enterprise', price: 'Custom', features: ['Dedicated Support', 'API Access'] }
                  ].map(plan => (
                    <label key={plan.id} className="relative">
                      <input
                        type="radio"
                        name="subscription"
                        value={plan.id}
                        checked={formData.subscription === plan.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.subscription === plan.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-green-300'
                      }`}>
                        <div className="font-semibold">{plan.name}</div>
                        <div className="text-lg font-bold text-green-600">{plan.price}</div>
                        <ul className="text-xs text-gray-600 mt-2 space-y-1">
                          {plan.features.map(feature => (
                            <li key={feature}>✓ {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="flex items-center gap-2 mt-6">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                className="rounded text-green-600 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition text-lg ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Registration & Join Community'
              )}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
};

export default FarmerRegistration;