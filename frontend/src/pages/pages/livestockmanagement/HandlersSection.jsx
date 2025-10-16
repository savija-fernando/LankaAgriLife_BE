import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/components/ui/Card';
import { Input } from '../../../components/components/ui/Input';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/components/ui/Button';
import { FaUserTie } from "react-icons/fa";
import {
  getAllLivestock,
  addLivestock,
  updateLivestockItem,
  deleteLivestockItem
} from '../../../api/livestockAPI';

const HandlersSection = () => {
  const [handlers, setHandlers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentHandler, setCurrentHandler] = useState({
    handler_id: '',
    firstName: '',
    lastName: '',
    password: '',
    email: '',
    contact_No: '',
  });

  useEffect(() => {
    fetchHandlers();
  }, []);

  const fetchHandlers = async () => {
    try {
      const res = await getAllLivestock();
      setHandlers(res.data);
    } catch (err) {
      console.error('Error fetching handlers:', err);
      alert('Failed to load handlers.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHandler((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!currentHandler.firstName || !currentHandler.lastName || !currentHandler.email) {
    alert("Please fill all required fields.");
    return;
  }

  try {
    if (editMode) {
      await updateLivestockItem(editMode, currentHandler);
      alert('Handler updated successfully');
    } else {
      const newHandler = { ...currentHandler, handler_id: Date.now().toString() };
      await addLivestock(newHandler);
      alert('Handler added successfully');
    }

    setIsModalOpen(false);
    setEditMode(null);
    setCurrentHandler({
      handler_id: '',
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      contact_No: '',
    });

    fetchHandlers();
  } catch (err) {
    console.error('Save error:', err);
    alert('Failed to save handler.');
  }
};


  const handleEdit = (id) => {
    const handler = handlers.find((h) => h.handler_id === id);
    setCurrentHandler(handler);
    setEditMode(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this handler?')) return;
    try {
      await deleteLivestockItem(id);
      alert('Handler deleted successfully');
      fetchHandlers();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete handler.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2">
          <FaUserTie className="w-8 h-8 text-green-600" /> Handlers
        </h2>
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(null);
            setCurrentHandler({ handler_id:'', firstName:'', lastName:'', password:'', email:'', contact_No:'' });
          }}
          className="flex items-center gap-2 bg-green-700 text-white hover:bg-green-600 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" /> Add Handler
        </Button>
      </div>

      {/* Handler Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {handlers.map((handler) => (
          <Card key={handler.handler_id} className="relative bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition">
            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => handleEdit(handler.handler_id)} className="text-yellow-500 hover:text-yellow-700 cursor-pointer transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(handler.handler_id)} className="text-red-600 hover:text-red-800 cursor-pointer transition-colors">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-semibold">{handler.firstName} {handler.lastName}</h3>
            <p><strong>Email:</strong> {handler.email}</p>
            <p><strong>Phone:</strong> {handler.contact_No}</p>
            <p><strong>Password:</strong> {handler.password}</p>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">{editMode ? 'Edit Handler' : 'Add New Handler'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
  <div>
    <label className="block text-green-700 font-semibold mb-1">First Name:</label>
    <Input
      name="firstName"
      placeholder="Enter First Name"
      value={currentHandler.firstName}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-green-700 font-semibold mb-1">Last Name:</label>
    <Input
      name="lastName"
      placeholder="Enter Last Name"
      value={currentHandler.lastName}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-green-700 font-semibold mb-1">Email:</label>
    <Input
      name="email"
      placeholder="Enter Email"
      value={currentHandler.email}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-green-700 font-semibold mb-1">Phone:</label>
    <Input
      name="contact_No"
      placeholder="Enter Contact No"
      value={currentHandler.contact_No}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-green-700 font-semibold mb-1">Password:</label>
    <Input
      name="password"
      placeholder="Enter Password"
      value={currentHandler.password}
      onChange={handleInputChange}
    />
  </div>

  <div className="flex justify-end gap-2">
    <Button onClick={() => setIsModalOpen(false)} className="bg-red-600">
      Cancel
    </Button>
    <Button type="submit" className="bg-green-700">
      {editMode ? 'Update' : 'Add'}
    </Button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
};

export default HandlersSection;
