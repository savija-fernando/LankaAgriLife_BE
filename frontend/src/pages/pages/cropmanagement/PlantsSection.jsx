import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../../components/components/ui/Card';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { Input } from '../../../components/components/ui/Input';
import { Button } from '../../../components/components/ui/Button';
import { GiWheat } from "react-icons/gi";

const API_URL = "http://localhost:8070/Plant";

const PlantsSection = () => {
  const [plants, setPlants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPlant, setCurrentPlant] = useState({
    crop_id: '',
    plantingDate: '',
    type: '',
    location: '',
    harvestDate: '',
    waterIntake: '',
    fertilizerIntake: '',
    employee_id: ''
  });

  // Load plants from backend on mount
  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await axios.get(API_URL);
      setPlants(response.data);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!currentPlant.crop_id.trim()) newErrors.crop_id = 'Crop ID is required';
    if (!currentPlant.plantingDate) newErrors.plantingDate = 'Planting date is required';
    if (!currentPlant.type.trim()) newErrors.type = 'Plant type is required';
    if (!currentPlant.location.trim()) newErrors.location = 'Location is required';
    if (!currentPlant.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    if (!currentPlant.employee_id.trim()) newErrors.employee_id = 'Employee ID is required';

    // Water intake validation
    if (!currentPlant.waterIntake.trim()) {
      newErrors.waterIntake = 'Water intake is required';
    } else {
      const waterValue = parseFloat(currentPlant.waterIntake);
      if (isNaN(waterValue) || waterValue <= 0) {
        newErrors.waterIntake = 'Water intake must be a positive number';
      } else if (waterValue > 10000) {
        newErrors.waterIntake = 'Water intake seems too high (max 10,000 ml)';
      } else if (!/^\d+$/.test(currentPlant.waterIntake)) {
        newErrors.waterIntake = 'Water intake must be a whole number (ml)';
      }
    }

    // Fertilizer intake validation
    if (!currentPlant.fertilizerIntake.trim()) {
      newErrors.fertilizerIntake = 'Fertilizer intake is required';
    } else {
      const fertilizerValue = parseFloat(currentPlant.fertilizerIntake);
      if (isNaN(fertilizerValue) || fertilizerValue <= 0) {
        newErrors.fertilizerIntake = 'Fertilizer intake must be a positive number';
      } else if (fertilizerValue > 5000) {
        newErrors.fertilizerIntake = 'Fertilizer intake seems too high (max 5,000 g)';
      } else if (!/^\d+$/.test(currentPlant.fertilizerIntake)) {
        newErrors.fertilizerIntake = 'Fertilizer intake must be a whole number (g)';
      }
    }

    // Date validation
    if (currentPlant.plantingDate && currentPlant.harvestDate) {
      const plantingDate = new Date(currentPlant.plantingDate);
      const harvestDate = new Date(currentPlant.harvestDate);
      
      if (harvestDate <= plantingDate) {
        newErrors.harvestDate = 'Harvest date must be after planting date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle modal input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setCurrentPlant((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Open modal for adding new plant
  const openAddModal = () => {
    setCurrentPlant({
      crop_id: '',
      plantingDate: '',
      type: '',
      location: '',
      harvestDate: '',
      waterIntake: '',
      fertilizerIntake: '',
      employee_id: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing plant
  const handleEditPlant = (crop_id) => {
    const plant = plants.find((p) => p.crop_id === crop_id);
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toISOString().slice(0, 10) : '';
    setCurrentPlant({
      ...plant,
      plantingDate: formatDate(plant.plantingDate),
      harvestDate: formatDate(plant.harvestDate),
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Add or update plant on submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      if (plants.some(p => p.crop_id === currentPlant.crop_id)) {
        // Update existing plant
        await axios.put(`${API_URL}/update/${currentPlant.crop_id}`, currentPlant);
        alert('Plant updated successfully!');
      } else {
        // Add new plant
        await axios.post(`${API_URL}/add`, currentPlant);
        alert('Plant added successfully!');
      }
      await fetchPlants();
      setIsModalOpen(false);
      setErrors({});
    } catch (error) {
      console.error("Error saving plant:", error);
      alert("Error saving plant, please check console.");
    }
  };

  // Delete plant
  const handleDeletePlant = async (crop_id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        await axios.delete(`${API_URL}/delete/${crop_id}`);
        setPlants(plants.filter(p => p.crop_id !== crop_id));
        alert('Plant deleted successfully!');
      } catch (error) {
        console.error("Error deleting plant:", error);
        alert("Error deleting plant, please check console.");
      }
    }
  };

  return (
    <div>
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <GiWheat className="w-8 h-8 text-green-600" />
          Plants
        </h2>
        <Button 
          onClick={openAddModal} 
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Plant
        </Button>
      </div>

      {/* Plants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <Card key={plant.crop_id} className="relative bg-white shadow-lg rounded-lg p-6 hover:scale-105 transform transition-all border-b-2 border-green-300">
            {/* Edit and Delete Icons */}
            <div className="absolute top-4 right-6 flex gap-2">
              <button
                onClick={() => handleEditPlant(plant.crop_id)}
                className="text-yellow-500 hover:text-yellow-700 cursor-pointer transition-colors"
                title="Edit"
              >
                <Edit className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleDeletePlant(plant.crop_id)}
                className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                title="Delete"
              >
                <Trash className="w-6 h-6" />
              </button>
            </div>
            {/* Plant Info */}
            <h3 className="text-xl font-semibold text-green-800">Crop ID: {plant.crop_id}</h3>
            <p className="text-black"><strong>Type:</strong> {plant.type}</p>
            <p className="text-black"><strong>Planted:</strong> {new Date(plant.plantingDate).toLocaleDateString()}</p>
            <p className="text-black"><strong>Harvested:</strong> {new Date(plant.harvestDate).toLocaleDateString()}</p>
            <p className="text-black"><strong>Location:</strong> {plant.location}</p>
            <p className="text-black"><strong>Water Intake per day:</strong> {plant.waterIntake} ml</p>
            <p className="text-black"><strong>Fertilizer Intake per week:</strong> {plant.fertilizerIntake} g</p>
            <p className="text-black"><strong>Employee ID:</strong> {plant.employee_id}</p>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              {plants.some(p => p.crop_id === currentPlant.crop_id) ? 'Edit Plant' : 'Add New Plant'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Crop ID */}
                <div>
                  <Input
                    name="crop_id"
                    placeholder="Crop ID"
                    value={currentPlant.crop_id}
                    onChange={handleInputChange}
                    required
                    disabled={plants.some(p => p.crop_id === currentPlant.crop_id)}
                    className={errors.crop_id ? 'border-red-500' : ''}
                  />
                  {errors.crop_id && <p className="text-red-500 text-sm mt-1">{errors.crop_id}</p>}
                </div>

                {/* Planting Date */}
                <div>
                  <Input
                    type="date"
                    name="plantingDate"
                    placeholder="Planting Date"
                    value={currentPlant.plantingDate}
                    onChange={handleInputChange}
                    required
                    className={errors.plantingDate ? 'border-red-500' : ''}
                  />
                  {errors.plantingDate && <p className="text-red-500 text-sm mt-1">{errors.plantingDate}</p>}
                </div>

                {/* Type */}
                <div>
                  <Input
                    name="type"
                    placeholder="Plant Type"
                    value={currentPlant.type}
                    onChange={handleInputChange}
                    required
                    className={errors.type ? 'border-red-500' : ''}
                  />
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Location */}
                <div>
                  <Input
                    name="location"
                    placeholder="Location"
                    value={currentPlant.location}
                    onChange={handleInputChange}
                    required
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Harvest Date */}
                <div>
                  <Input
                    type="date"
                    name="harvestDate"
                    placeholder="Harvest Date"
                    value={currentPlant.harvestDate}
                    onChange={handleInputChange}
                    required
                    className={errors.harvestDate ? 'border-red-500' : ''}
                  />
                  {errors.harvestDate && <p className="text-red-500 text-sm mt-1">{errors.harvestDate}</p>}
                </div>

                {/* Water Intake */}
                <div>
                  <Input
                    name="waterIntake"
                    placeholder="Water Intake (ml per day)"
                    value={currentPlant.waterIntake}
                    onChange={handleInputChange}
                    required
                    className={errors.waterIntake ? 'border-red-500' : ''}
                  />
                  {errors.waterIntake && <p className="text-red-500 text-sm mt-1">{errors.waterIntake}</p>}
                  {!errors.waterIntake && currentPlant.waterIntake && (
                    <p className="text-gray-500 text-sm mt-1">Water intake per day in milliliters (ml)</p>
                  )}
                </div>

                {/* Fertilizer Intake */}
                <div>
                  <Input
                    name="fertilizerIntake"
                    placeholder="Fertilizer Intake (g per week)"
                    value={currentPlant.fertilizerIntake}
                    onChange={handleInputChange}
                    required
                    className={errors.fertilizerIntake ? 'border-red-500' : ''}
                  />
                  {errors.fertilizerIntake && <p className="text-red-500 text-sm mt-1">{errors.fertilizerIntake}</p>}
                  {!errors.fertilizerIntake && currentPlant.fertilizerIntake && (
                    <p className="text-gray-500 text-sm mt-1">Fertilizer intake per week in grams (g)</p>
                  )}
                </div>

                {/* Employee ID */}
                <div>
                  <Input
                    name="employee_id"
                    placeholder="Employee ID"
                    value={currentPlant.employee_id}
                    onChange={handleInputChange}
                    required
                    className={errors.employee_id ? 'border-red-500' : ''}
                  />
                  {errors.employee_id && <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>}
                </div>

                <div className="flex justify-end space-x-4 mt-4">
                  <Button 
                    onClick={() => setIsModalOpen(false)} 
                    className="bg-red-600 hover:bg-red-500"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    {plants.some(p => p.crop_id === currentPlant.crop_id) ? 'Update Plant' : 'Add Plant'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantsSection;