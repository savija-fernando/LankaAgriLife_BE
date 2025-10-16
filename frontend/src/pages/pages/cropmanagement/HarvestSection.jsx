import React, { useState, useEffect } from "react";
import { Card } from "../../../components/components/ui/Card";
import { Input } from "../../../components/components/ui/Input";
import { Edit, Trash, PlusCircle } from "lucide-react"; // Icons
import { Button } from "../../../components/components/ui/Button";
import {
  getAllHarvests,
  addHarvest,
  updateHarvest,
  deleteHarvest,
} from "../../../api/harvestAPI"; // Assume your axios helpers are here

const HarvestSection = () => {
  const [harvests, setHarvests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null); // harvest_id being edited
  const [currentHarvest, setCurrentHarvest] = useState({
    harvest_id: "",
    type: "",
    quantity: "",
    harvestDate: "",
    note: "",
  });

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
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHarvest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open add modal
  const openAddModal = () => {
    setCurrentHarvest({
      harvest_id: "",
      type: "",
      quantity: "",
      harvestDate: "",
      note: "",
    });
    setEditMode(null);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEditHarvest = (id) => {
    const harvest = harvests.find((h) => h.harvest_id === id);
    if (harvest) {
      setCurrentHarvest({
        ...harvest,
        harvestDate: new Date(harvest.harvestDate)
          .toISOString()
          .slice(0, 10), // Format date for input[type=date]
      });
      setEditMode(id);
      setIsModalOpen(true);
    }
  };

  // Handle delete
  const handleDeleteHarvest = async (id) => {
    if (window.confirm("Are you sure you want to delete this harvest?")) {
      try {
        await deleteHarvest(id);
        setHarvests(harvests.filter((h) => h.harvest_id !== id));
        alert("Harvest deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete harvest.");
      }
    }
  };

  // Handle add or update submit
  const handleAddOrEditHarvestSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update
        await updateHarvest(editMode, currentHarvest);
        alert("Harvest updated successfully!");
      } else {
        // Add
        await addHarvest(currentHarvest);
        alert("Harvest added successfully!");
      }
      fetchHarvests();
      setIsModalOpen(false);
      setEditMode(null);
      setCurrentHarvest({
        harvest_id: "",
        type: "",
        quantity: "",
        harvestDate: "",
        note: "",
      });
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving harvest, please try again.");
    }
  };

  return (
    <div>
      {/* Title Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-black font-serif flex items-center gap-2">
          <PlusCircle className="w-8 h-8 text-blue-600" />
          Harvests
        </h2>
        <Button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Harvest
        </Button>
      </div>

      {/* Harvest List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {harvests.map((harvest) => (
          <Card
            key={harvest.harvest_id}
            className="relative bg-green-100 shadow-lg rounded-lg p-6 hover:scale-105 transform transition-all border-b-2 border-green-300"
          >
            {/* Edit and Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEditHarvest(harvest.harvest_id)}
                className="text-yellow-500 hover:text-yellow-700 cursor-pointer transition-colors"
                title="Edit"
              >
                <Edit className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleDeleteHarvest(harvest.harvest_id)}
                className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                title="Delete"
              >
                <Trash className="w-6 h-6" />
              </button>
            </div>

            {/* Harvest Info */}
            <p className="text-black font-semibold mb-2">
              <strong>ID:</strong> {harvest.harvest_id}
            </p>
            <h3 className="text-xl font-semibold text-black">{harvest.type}</h3>
            <p className="text-black">
              <strong>Quantity:</strong> {harvest.quantity}
            </p>
            <p className="text-black">
              <strong>Harvest Date:</strong>{" "}
              {new Date(harvest.harvestDate).toLocaleDateString()}
            </p>
            <p className="text-black">
              <strong>Note:</strong> {harvest.note}
            </p>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">
              {editMode ? "Edit Harvest" : "Add New Harvest"}
            </h2>
            <form onSubmit={handleAddOrEditHarvestSubmit}>
  <div className="space-y-4">
    {!editMode && (
      <div>
        <label className="block text-green-700 font-semibold mb-1">Harvest ID:</label>
        <Input
          name="harvest_id"
          placeholder="Enter Harvest ID"
          value={currentHarvest.harvest_id}
          onChange={handleInputChange}
          required
          className="border-2 border-black"
        />
      </div>
    )}

    <div>
      <label className="block text-green-700 font-semibold mb-1">Type:</label>
      <Input
        name="type"
        placeholder="Enter Type"
        value={currentHarvest.type}
        onChange={handleInputChange}
        required
        className="border-2 border-black"
      />
    </div>

    <div>
      <label className="block text-green-700 font-semibold mb-1">Quantity:</label>
      <Input
        name="quantity"
        placeholder="Enter Quantity"
        value={currentHarvest.quantity}
        onChange={handleInputChange}
        required
        className="border-2 border-black"
      />
    </div>

    <div>
      <label className="block text-green-700 font-semibold mb-1">Harvest Date:</label>
      <Input
        type="date"
        name="harvestDate"
        value={currentHarvest.harvestDate}
        onChange={handleInputChange}
        required
        className="border-2 border-black"
      />
    </div>

    <div>
      <label className="block text-green-700 font-semibold mb-1">Note:</label>
      <Input
        name="note"
        placeholder="Enter Note"
        value={currentHarvest.note}
        onChange={handleInputChange}
        className="border-2 border-black"
      />
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
        className={`${
          editMode ? "bg-yellow-500 hover:bg-yellow-400" : "bg-blue-600 hover:bg-blue-500"
        } text-white`}
      >
        {editMode ? "Update Harvest" : "Add Harvest"}
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

export default HarvestSection;
