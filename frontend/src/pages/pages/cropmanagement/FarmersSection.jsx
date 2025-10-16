import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/components/ui/Card';
import { Input } from '../../../components/components/ui/Input';
import { Mail, Phone, User, Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/components/ui/Button';
import { GiFarmTractor } from "react-icons/gi";

import {
  getAllFarmers,
  addFarmer,
  updateFarmer,
  deleteFarmer
} from '../../../api/farmerAPI';

const FarmersSection = () => {
  const [farmers, setFarmers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [newFarmerData, setNewFarmerData] = useState({
    farmer_id: '',
    f_name: '',
    l_name: '',
    loginCredentials: '',
    email: '',
    contact_No: ''
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await getAllFarmers();
      setFarmers(response.data);
      setErrorMsg('');
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setErrorMsg("Failed to load farmers.");
    }
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'farmer_id':
        if (!value.trim()) return 'Farmer ID is required';
        if (!/^[A-Za-z0-9_-]+$/.test(value)) return 'Farmer ID can only contain letters, numbers, hyphens, and underscores';
        if (value.length > 20) return 'Farmer ID must be less than 20 characters';
        return '';

      case 'f_name':
        if (!value.trim()) return 'First name is required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'First name can only contain letters and spaces';
        if (value.length < 2) return 'First name must be at least 2 characters';
        if (value.length > 50) return 'First name must be less than 50 characters';
        return '';

      case 'l_name':
        if (!value.trim()) return 'Last name is required';
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Last name can only contain letters and spaces';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        if (value.length > 50) return 'Last name must be less than 50 characters';
        return '';

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        if (value.length > 100) return 'Email must be less than 100 characters';
        return '';

      case 'contact_No':
        if (value) {
          if (!/^\d+$/.test(value)) return 'Phone number must contain only digits';
          if (value.length < 10) return 'Phone number must be at least 10 digits';
          if (value.length > 15) return 'Phone number must be less than 15 digits';
        }
        return '';

      case 'loginCredentials':
        if (value && value.length > 50) return 'Login credentials must be less than 50 characters';
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(newFarmerData).forEach(field => {
      const error = validateField(field, newFarmerData[field]);
      if (error) newErrors[field] = error;
    });

    // Additional business logic validations
    if (!newFarmerData.farmer_id) newErrors.farmer_id = 'Farmer ID is required';
    if (!newFarmerData.f_name) newErrors.f_name = 'First name is required';
    if (!newFarmerData.l_name) newErrors.l_name = 'Last name is required';

    // Check for duplicate farmer_id in add mode
    if (!editMode && farmers.some(f => f.farmer_id === newFarmerData.farmer_id)) {
      newErrors.farmer_id = 'Farmer ID already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setNewFarmerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleAddOrEditFarmerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      setErrorMsg("Please fix the validation errors before submitting.");
      return;
    }

    try {
      if (editMode) {
        await updateFarmer(editMode, newFarmerData);
        alert("Farmer updated successfully!");
      } else {
        await addFarmer(newFarmerData);
        alert("Farmer added successfully!");
      }

      setIsModalOpen(false);
      setEditMode(null);
      setNewFarmerData({
        farmer_id: '',
        f_name: '',
        l_name: '',
        loginCredentials: '',
        email: '',
        contact_No: ''
      });
      setErrors({});
      fetchFarmers();
    } catch (err) {
      console.error("Error saving farmer:", err);
      const serverError = err.response?.data?.message || err.message;
      setErrorMsg("Failed to save farmer: " + serverError);
    }
  };

  const handleEditFarmer = (farmer_id) => {
    const farmer = farmers.find(f => f.farmer_id === farmer_id);
    if (!farmer) {
      alert("Farmer not found for editing");
      return;
    }
    setNewFarmerData({
      farmer_id: farmer.farmer_id,
      f_name: farmer.f_name,
      l_name: farmer.l_name,
      loginCredentials: farmer.loginCredentials,
      email: farmer.email,
      contact_No: farmer.contact_No?.toString() || ''
    });
    setEditMode(farmer.farmer_id);
    setIsModalOpen(true);
    setErrorMsg('');
    setErrors({});
  };

  const handleDeleteFarmer = async (farmer_id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;
    try {
      await deleteFarmer(farmer_id);
      alert("Farmer deleted successfully!");
      fetchFarmers();
    } catch (err) {
      console.error("Error deleting farmer:", err);
      setErrorMsg("Failed to delete farmer.");
    }
  };

  const openAddModal = () => {
    setNewFarmerData({
      farmer_id: '',
      f_name: '',
      l_name: '',
      loginCredentials: '',
      email: '',
      contact_No: ''
    });
    setEditMode(null);
    setErrorMsg('');
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <GiFarmTractor className="w-8 h-8 text-green-600" />
          Farmers
        </h2>
        <Button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-700 text-white hover:bg-blue-600 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Farmer
        </Button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Farmers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmers.map((farmer) => (
          <Card
            key={farmer.farmer_id}
            className="relative bg-green-100 shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 border-b-2 border-green-300"
          >
            <div className="absolute top-4 right-6 flex gap-2">
              <button
                onClick={() => handleEditFarmer(farmer.farmer_id)}
                className="text-yellow-500 hover:text-yellow-600 transition-colors"
                title="Edit Farmer"
              >
                <Edit className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleDeleteFarmer(farmer.farmer_id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete Farmer"
              >
                <Trash className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-green-600" />
              {farmer.f_name} {farmer.l_name}
            </h3>
            <div className="space-y-2">
              <p className="text-black flex items-center gap-2">
                <strong>ID:</strong> {farmer.farmer_id}
              </p>
              {farmer.email && (
                <p className="text-black flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <strong>Email:</strong> {farmer.email}
                </p>
              )}
              {farmer.contact_No && (
                <p className="text-black flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <strong>Phone:</strong> {farmer.contact_No}
                </p>
              )}
              {farmer.loginCredentials && (
                <p className="text-black">
                  <strong>Credentials:</strong> {farmer.loginCredentials}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(null);
                setErrorMsg('');
                setErrors({});
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              {editMode ? 'Edit Farmer' : 'Add New Farmer'}
            </h2>
            <form onSubmit={handleAddOrEditFarmerSubmit} className="space-y-6">

  {/* 🧑 Farmer Information Header */}
  <h3 className="text-lg font-semibold text-green-700 border-b pb-1">
    Farmer Information
  </h3>

  {/* Farmer ID */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Farmer ID *</label>
    <Input
      name="farmer_id"
      placeholder="Enter Farmer ID"
      value={newFarmerData.farmer_id}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      disabled={!!editMode}
      className={`border-2 ${errors.farmer_id ? 'border-red-500' : 'border-green-500'}`}
    />
    {errors.farmer_id && <p className="text-red-500 text-sm mt-1">{errors.farmer_id}</p>}
  </div>

  {/* First Name */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">First Name *</label>
    <Input
      name="f_name"
      placeholder="Enter First Name"
      value={newFarmerData.f_name}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      className={`border-2 ${errors.f_name ? 'border-red-500' : 'border-green-500'}`}
    />
    {errors.f_name && <p className="text-red-500 text-sm mt-1">{errors.f_name}</p>}
  </div>

  {/* Last Name */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Last Name *</label>
    <Input
      name="l_name"
      placeholder="Enter Last Name"
      value={newFarmerData.l_name}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      className={`border-2 ${errors.l_name ? 'border-red-500' : 'border-green-500'}`}
    />
    {errors.l_name && <p className="text-red-500 text-sm mt-1">{errors.l_name}</p>}
  </div>

  {/* 📧 Contact Information Header */}
  <h3 className="text-lg font-semibold text-green-700 border-b pb-1">
    Contact Information
  </h3>

  {/* Email */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Email</label>
    <Input
      name="email"
      placeholder="Enter Email Address"
      value={newFarmerData.email}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      className={`border-2 ${errors.email ? 'border-red-500' : 'border-green-500'}`}
      type="email"
    />
    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  </div>

  {/* Contact Number */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
    <Input
      name="contact_No"
      placeholder="Enter Phone Number"
      value={newFarmerData.contact_No}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      className={`border-2 ${errors.contact_No ? 'border-red-500' : 'border-green-500'}`}
      type="tel"
    />
    {errors.contact_No && <p className="text-red-500 text-sm mt-1">{errors.contact_No}</p>}
    {!errors.contact_No && newFarmerData.contact_No && (
      <p className="text-gray-500 text-sm mt-1">
        10–15 digits without spaces or special characters
      </p>
    )}
  </div>

  {/* 🔐 Login Credentials Header */}
  <h3 className="text-lg font-semibold text-green-700 border-b pb-1">
    Login Information
  </h3>

  {/* Login Credentials */}
  <div>
    <label className="block text-gray-700 font-medium mb-1">Login Credentials</label>
    <Input
      name="loginCredentials"
      placeholder="Enter Login Credentials"
      value={newFarmerData.loginCredentials}
      onChange={handleModalInputChange}
      onBlur={handleBlur}
      className={`border-2 ${errors.loginCredentials ? 'border-red-500' : 'border-green-500'}`}
    />
    {errors.loginCredentials && <p className="text-red-500 text-sm mt-1">{errors.loginCredentials}</p>}
  </div>

  {/* Buttons */}
  <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
    <Button
      onClick={() => {
        setIsModalOpen(false);
        setEditMode(null);
        setErrorMsg('');
        setErrors({});
      }}
      className="bg-gray-500 hover:bg-gray-400 text-white px-6"
      type="button"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      className={`${
        editMode ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-blue-700 hover:bg-blue-600'
      } text-white px-6`}
    >
      {editMode ? 'Update Farmer' : 'Add Farmer'}
    </Button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersSection;