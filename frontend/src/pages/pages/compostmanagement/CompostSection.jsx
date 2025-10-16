import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/components/ui/Card';
import { Button } from '../../../components/components/ui/Button';
import { Input } from '../../../components/components/ui/Input';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { GiFertilizerBag } from "react-icons/gi";

import {
  getAllCompost,
  addCompost,
  updateCompost,
  deleteCompost
} from '../../../api/compostAPI';

const CompostSection = () => {
  const [composts, setComposts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentCompost, setCurrentCompost] = useState({
    compost_id: '',
    quantity: '',
    fermentingDate: '',
    compostStatus: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchComposts();
  }, []);

  const fetchComposts = async () => {
    try {
      const res = await getAllCompost();
      setComposts(res.data);
      setErrorMsg('');
    } catch (err) {
      console.error("Error fetching composts:", err);
      setErrorMsg('Failed to load compost records.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompost(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentCompost.compost_id || !currentCompost.quantity || !currentCompost.fermentingDate) {
      setErrorMsg("Please fill in Compost ID, Quantity and Fermenting Date.");
      return;
    }

    try {
      if (editMode) {
        const dataToSend = {
          quantity: currentCompost.quantity,
          compostStatus: currentCompost.compostStatus,
          fermentingDate: currentCompost.fermentingDate,
        };
        await updateCompost(editMode, dataToSend);
        alert("Compost record updated successfully");
      } else {
        const dataToSend = {
          compost_id: currentCompost.compost_id,
          quantity: currentCompost.quantity,
          compostStatus: currentCompost.compostStatus,
          fermentingDate: currentCompost.fermentingDate,
        };
        await addCompost(dataToSend);
        alert("Compost added successfully");
      }

      setIsModalOpen(false);
      setEditMode(null);
      setCurrentCompost({
        compost_id: '',
        quantity: '',
        fermentingDate: '',
        compostStatus: '',
      });
      fetchComposts();

    } catch (err) {
      const serverError = err.response?.data?.error || err.response?.data || err.message;
      setErrorMsg("Failed to save compost record: " + serverError);
    }
  };

  const handleEdit = (compost_id) => {
    const comp = composts.find(c => c.compost_id === compost_id);
    if (!comp) {
      alert("Record not found for editing");
      return;
    }
    setCurrentCompost({
      compost_id: comp.compost_id,
      quantity: comp.quantity?.toString() || '',
      fermentingDate: comp.fermentingDate ? comp.fermentingDate.slice(0, 10) : '',
      compostStatus: comp.compostStatus || '',
    });
    setEditMode(compost_id);
    setIsModalOpen(true);
    setErrorMsg('');
  };

  const handleDelete = async (compost_id) => {
    if (!window.confirm("Delete this compost record?")) return;
    try {
      await deleteCompost(compost_id);
      alert("Compost record deleted successfully");
      fetchComposts();
    } catch (err) {
      setErrorMsg("Failed to delete compost record.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <GiFertilizerBag className="w-8 h-8 text-green-600" />
          Compost
        </h2>
        <Button
          onClick={() => {
            setCurrentCompost({
              compost_id: '',
              quantity: '',
              fermentingDate: '',
              compostStatus: '',
            });
            setEditMode(null);
            setErrorMsg('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-green-700 text-white hover:bg-green-600 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5 text-blue-500" /> Add Compost
        </Button>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Compost Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {composts.map((c) => (
          <Card key={c.compost_id} className="relative bg-green-50 shadow-lg rounded-lg p-6 border-b-2 border-green-300">
            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-6 flex gap-2">
              <button onClick={() => handleEdit(c.compost_id)} className="text-green-500 hover:text-green-600">
                <Edit className="w-6 h-6" />
              </button>
              <button onClick={() => handleDelete(c.compost_id)} className="text-green-600 hover:text-green-800">
                <Trash className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-green-800">Compost #{c.compost_id}</h3>
            <p><strong>Quantity:</strong> {c.quantity}</p>
            <p><strong>Fermenting Date:</strong> {c.fermentingDate ? new Date(c.fermentingDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {c.compostStatus}</p>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              {editMode ? 'Edit Compost' : 'Add New Compost'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">

  {/* Section Header */}
  <h3 className="text-lg font-semibold text-green-800 border-b pb-1">Compost Details</h3>

  {/* Compost ID (only for Add) */}
  {!editMode && (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Compost ID</label>
      <Input
        name="compost_id"
        placeholder="Enter Compost ID"
        value={currentCompost.compost_id}
        onChange={handleInputChange}
      />
    </div>
  )}

  {/* Quantity */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg)</label>
    <Input
      name="quantity"
      type="number"
      placeholder="Enter Quantity"
      value={currentCompost.quantity}
      onChange={handleInputChange}
    />
  </div>

  {/* Section Header */}
  <h3 className="text-lg font-semibold text-green-800 border-b pb-1 mt-4">Fermentation Info</h3>

  {/* Fermenting Date */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Fermenting Date</label>
    <Input
      name="fermentingDate"
      type="date"
      value={currentCompost.fermentingDate}
      onChange={handleInputChange}
    />
  </div>

  {/* Compost Status */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Compost Status</label>
    <Input
      name="compostStatus"
      placeholder="Enter Compost Status (e.g. Fresh, Fermenting, Ready)"
      value={currentCompost.compostStatus}
      onChange={handleInputChange}
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-3 mt-6">
    <Button
      onClick={() => setIsModalOpen(false)}
      type="button"
      className="bg-red-600 hover:bg-red-500"
    >
      Cancel
    </Button>
    <Button type="submit" className="bg-green-700 hover:bg-green-600">
      {editMode ? 'Update Compost' : 'Add Compost'}
    </Button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default CompostSection;
