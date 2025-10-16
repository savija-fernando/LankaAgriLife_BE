import React from "react";
import { NavLink } from "react-router-dom"; // Add this import

const CTA = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 bg-clip-text text-transparent">
            Ready to Grow With Us?
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
          Join our thriving community of passionate farmers and cultivate success together.
        </p>

        {/* Additional benefit points */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm sm:text-base">
          <div className="flex items-center text-green-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Premium Support
          </div>
          <div className="flex items-center text-green-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Modern Tools
          </div>
          <div className="flex items-center text-green-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Community Access
          </div>
        </div>

      
        {/* CTA Button */}
<div className="mt-12">
  <NavLink
    to="/login"
    className="group relative inline-flex items-center justify-center px-8 py-4 sm:px-12 sm:py-5 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:from-green-500 hover:to-emerald-500 overflow-hidden"
  >
    {/* Button shine effect */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    
    {/* Button content */}
    <span className="relative flex items-center">
      Join as a Farmer
      <svg 
        className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
         </svg>
        </span>
      </NavLink>
    </div>

        {/* Trust indicator */}
        <div className="mt-8 text-sm text-gray-600 font-medium">
          <p>Join 500+ successful farmers already growing with us</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;