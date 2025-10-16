import React, { useState, useEffect } from "react";
import { Card } from "../../../components/components/ui/Card";
import { Input } from "../../../components/components/ui/Input";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { Button } from "../../../components/components/ui/Button";
import { GiCow } from "react-icons/gi";

import {
  getAllAnimals,
  addAnimal,
  updateAnimal,
  deleteAnimal,
} from "../../../api/animalAPI";

const AnimalsSection = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentAnimal, setCurrentAnimal] = useState({
    animal_id: "",
    species: "",
    breedingDetails: "",
    feedingData: "",
    healthRecord: "",
    dateOfBirth: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const res = await getAllAnimals();
      setAnimals(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching animals:", err);
      setError("Failed to load animals.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAnimal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentAnimal.animal_id || !currentAnimal.species || !currentAnimal.breedingDetails || !currentAnimal.healthRecord) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      return;
    }

    try {
      if (editMode) {
        await updateAnimal(editMode, currentAnimal);
        setMessage("Animal updated successfully!");
        setMessageType("success");
      } else {
        await addAnimal(currentAnimal);
        setMessage("Animal added successfully!");
        setMessageType("success");
      }

      closeModal();
      fetchAnimals();
    } catch (err) {
      console.error("Save error:", err);
      setMessage("Failed to save animal.");
      setMessageType("error");
    }
  };

  const handleEdit = (id) => {
    const animal = animals.find((a) => a.animal_id === id);
    setCurrentAnimal({
      ...animal,
      feedingData: animal.feedingData ? animal.feedingData.slice(0, 10) : "",
      dateOfBirth: animal.dateOfBirth ? animal.dateOfBirth.slice(0, 10) : "",
    });
    setEditMode(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this animal?")) return;
    try {
      await deleteAnimal(id);
      setMessage("Animal deleted successfully!");
      setMessageType("success");
      fetchAnimals();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete animal.");
      setMessageType("error");
    }
  };

  const resetForm = () => {
    setCurrentAnimal({
      animal_id: "",
      species: "",
      breedingDetails: "",
      feedingData: "",
      healthRecord: "",
      dateOfBirth: "",
    });
    setEditMode(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div>
      {/* Popup Message */}
      {message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-30 ${
            messageType === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message}
          <button className="ml-3 font-bold" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2">
          <GiCow className="w-8 h-8 text-green-600" />
          Animals
        </h2>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 !bg-blue-600 text-white hover:!bg-blue-500 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Animal
        </Button>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-center text-gray-600">Loading animals...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <Card
              key={animal.animal_id}
              className="relative bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition"
            >
              {/* Edit/Delete */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEdit(animal.animal_id)}
                  className="text-yellow-500 hover:text-yellow-700 transition-colors"
                  aria-label={`Edit animal ${animal.animal_id}`}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(animal.animal_id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  aria-label={`Delete animal ${animal.animal_id}`}
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>

              {/* Animal Details */}
              <h3 className="text-xl font-semibold text-green-800">{animal.species}</h3>
              <p className="text-black">
                <strong>ID:</strong> {animal.animal_id}
              </p>
              <p className="text-black">
                <strong>Breeding:</strong> {animal.breedingDetails}
              </p>
              <p className="text-black">
                <strong>Feeding:</strong>{" "}
                {animal.feedingData ? new Date(animal.feedingData).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-black">
                <strong>Health:</strong> {animal.healthRecord}
              </p>
              <p className="text-black">
                <strong>DOB:</strong>{" "}
                {animal.dateOfBirth ? new Date(animal.dateOfBirth).toLocaleDateString() : "N/A"}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              {editMode ? "Edit Animal" : "Add New Animal"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">

  <h4 className="font-semibold text-green-800">Animal ID</h4>
  <Input
    name="animal_id"
    placeholder="Enter Animal ID"
    value={currentAnimal.animal_id}
    onChange={handleInputChange}
    required
    disabled={editMode !== null}
  />

  <h4 className="font-semibold text-green-800">Species</h4>
  <Input
    name="species"
    placeholder="Enter Animal Species (e.g., Hen, Cow)"
    value={currentAnimal.species}
    onChange={handleInputChange}
    required
  />

  <h4 className="font-semibold text-green-800">Breeding Details</h4>
  <Input
    name="breedingDetails"
    placeholder="Enter Breeding Details"
    value={currentAnimal.breedingDetails}
    onChange={handleInputChange}
    required
  />

  <h4 className="font-semibold text-green-800">Feeding Date</h4>
  <Input
    type="date"
    name="feedingData"
    value={currentAnimal.feedingData}
    onChange={handleInputChange}
  />

  <h4 className="font-semibold text-green-800">Health Record</h4>
  <Input
    name="healthRecord"
    placeholder="Enter Health Record"
    value={currentAnimal.healthRecord}
    onChange={handleInputChange}
    required
  />

  <h4 className="font-semibold text-green-800">Date of Birth</h4>
  <Input
    type="date"
    name="dateOfBirth"
    value={currentAnimal.dateOfBirth}
    onChange={handleInputChange}
  />

  <div className="flex justify-end gap-2 mt-4">
    <Button type="button" onClick={closeModal} className="!bg-red-600 text-white">
      Cancel
    </Button>
    <Button type="submit" className="!bg-blue-600 text-white">
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

export default AnimalsSection;
