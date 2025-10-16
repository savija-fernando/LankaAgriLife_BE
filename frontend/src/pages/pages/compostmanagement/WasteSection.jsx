import React, { useState, useEffect } from "react";
import { Card } from "../../../components/components/ui/Card";
import { Button } from "../../../components/components/ui/Button";
import { Input } from "../../../components/components/ui/Input";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { MdCompost } from "react-icons/md";
import {
  getAllWaste,
  addWaste,
  updateWaste,
  deleteWaste,
} from "../../../api/wasteAPI"; // <-- your axios API

const WasteSection = () => {
  const [wastes, setWastes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentWaste, setCurrentWaste] = useState({
    waste_id: "",
    quantity: "",
    type: "",
    date: "",
  });

  // Fetch all waste data on load
  useEffect(() => {
    fetchWastes();
  }, []);

  const fetchWastes = async () => {
    try {
      const res = await getAllWaste();
      setWastes(res.data);
    } catch (err) {
      console.error("Error fetching wastes:", err);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentWaste((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateWaste(editMode, currentWaste);
        alert("Waste updated successfully!");
      } else {
        await addWaste(currentWaste);
        alert("Waste added successfully!");
      }
      setIsModalOpen(false);
      setEditMode(null);
      setCurrentWaste({ waste_id: "", quantity: "", type: "", date: "" });
      fetchWastes();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save waste!");
    }
  };

  // Edit waste
  const handleEdit = (id) => {
    const waste = wastes.find((w) => w._id === id);
    setCurrentWaste({
      waste_id: waste.waste_id,
      quantity: waste.quantity,
      type: waste.type,
      date: waste.date ? waste.date.split("T")[0] : "",
    });
    setEditMode(id);
    setIsModalOpen(true);
  };

  // Delete waste
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this waste record?")) return;
    try {
      await deleteWaste(id);
      alert("Waste deleted successfully!");
      fetchWastes();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete waste!");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <MdCompost className="w-8 h-8 text-green-600" />
          Waste
        </h2>
        <Button
          onClick={() => {
            setCurrentWaste({ waste_id: "", quantity: "", type: "", date: "" });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" /> Add Waste
        </Button>
      </div>

      {/* Waste List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wastes.map((w) => (
          <Card
            key={w._id}
            className="relative bg-green-50 shadow-lg rounded-lg p-6 border-b-2 border-green-300"
          >
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(w._id)}
                className="bg-yellow-400 text-white p-1 rounded hover:bg-yellow-500"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(w._id)}
                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-green-800">
              Waste #{w.waste_id}
            </h3>
            <p>
              <strong>Quantity:</strong> {w.quantity} kgs
            </p>
            <p>
              <strong>Type:</strong> {w.type}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {w.date ? new Date(w.date).toLocaleDateString() : "N/A"}
            </p>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              {editMode ? "Edit Waste" : "Add Waste"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Waste Information */}
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-300 pb-1">
                Waste Information
              </h3>

              {!editMode && (
                <Input
                  name="waste_id"
                  placeholder="Waste ID"
                  value={currentWaste.waste_id}
                  onChange={handleInputChange}
                />
              )}
              <Input
                name="quantity"
                type="number"
                placeholder="Quantity (kgs)"
                value={currentWaste.quantity}
                onChange={handleInputChange}
              />
              <Input
                name="type"
                placeholder="Waste Type"
                value={currentWaste.type}
                onChange={handleInputChange}
              />

              {/* Date Details */}
              <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-300 pb-1 mt-3">
                Date Details
              </h3>
              <Input
                name="date"
                type="date"
                value={currentWaste.date}
                onChange={handleInputChange}
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-500"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                  {editMode ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteSection;
