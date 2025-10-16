import React, { useState, useEffect } from "react";
import { Card } from "../../../components/components/ui/Card";
import { Button } from "../../../components/components/ui/Button";
import { Input } from "../../../components/components/ui/Input";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { GiPitchfork } from "react-icons/gi";
import {
  getAllCompostHandlers,
  addCompostHandler,
  updateCompostHandler,
  deleteCompostHandler,
} from "../../../api/compostHandler";

const CompostHandlerSection = () => {
  const [handlers, setHandlers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentHandler, setCurrentHandler] = useState({
    CompostHandler_id: "",
    f_name: "",
    l_name: "",
    loginCredentials: "",
    email: "",
    contact_No: "",
  });

  // Fetch all handlers from MongoDB
  useEffect(() => {
    fetchHandlers();
  }, []);

  const fetchHandlers = async () => {
    try {
      const res = await getAllCompostHandlers();
      setHandlers(res.data);
    } catch (err) {
      console.error("Error fetching compost handlers:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHandler((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateCompostHandler(editMode, currentHandler);
        alert("Handler updated successfully");
      } else {
        await addCompostHandler(currentHandler);
        alert("Handler added successfully");
      }
      setIsModalOpen(false);
      setEditMode(null);
      setCurrentHandler({
        CompostHandler_id: "",
        f_name: "",
        l_name: "",
        loginCredentials: "",
        email: "",
        contact_No: "",
      });
      fetchHandlers();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save handler");
    }
  };

  const handleEdit = (id) => {
    const handler = handlers.find((h) => h.CompostHandler_id === id);
    setCurrentHandler(handler);
    setEditMode(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this compost handler?")) return;
    try {
      await deleteCompostHandler(id);
      alert("Handler deleted successfully");
      fetchHandlers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete handler");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 font-serif flex items-center gap-2">
          <GiPitchfork className="w-8 h-8 text-green-600" />
          Compost Handlers
        </h2>
        <Button
          onClick={() => {
            setCurrentHandler({
              CompostHandler_id: "",
              f_name: "",
              l_name: "",
              loginCredentials: "",
              email: "",
              contact_No: "",
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-green-700 text-white hover:bg-green-600 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" /> Add Handler
        </Button>
      </div>

      {/* Handlers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {handlers.map((h) => (
          <Card
            key={h.CompostHandler_id}
            className="relative bg-green-50 shadow-lg rounded-lg p-6 border-b-2 border-green-300"
          >
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleEdit(h.CompostHandler_id)}
                className="bg-yellow-400 text-white p-1 rounded hover:bg-yellow-500"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(h.CompostHandler_id)}
                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>

            {/* Display all fields dynamically */}
            {Object.entries(h).map(([key, value]) => {
              if (key === "__v") return null; // skip internal MongoDB fields
              return (
                <p key={key}>
                  <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                  {value?.toString()}
                </p>
              );
            })}
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
              {editMode ? "Edit Handler" : "Add Handler"}
            </h2>
           <form onSubmit={handleSubmit} className="space-y-4">
              {/* Section 1: Basic Info */}
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-300 pb-1">
                Basic Info
              </h3>
              <Input
                name="CompostHandler_id"
                placeholder="Handler ID"
                value={currentHandler.CompostHandler_id}
                onChange={handleInputChange}
                disabled={!!editMode}
              />
              <div className="flex gap-2">
                <Input
                  name="f_name"
                  placeholder="First Name"
                  value={currentHandler.f_name}
                  onChange={handleInputChange}
                />
                <Input
                  name="l_name"
                  placeholder="Last Name"
                  value={currentHandler.l_name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Section 2: Login Details */}
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-300 pb-1 mt-3">
                Login Details
              </h3>
              <Input
                name="loginCredentials"
                placeholder="Login Credentials"
                value={currentHandler.loginCredentials}
                onChange={handleInputChange}
              />

              {/* Section 3: Contact Info */}
              <h3 className="text-lg font-semibold text-green-600 border-b border-green-300 pb-1 mt-3">
                Contact Info
              </h3>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={currentHandler.email}
                onChange={handleInputChange}
              />
              <Input
                name="contact_No"
                type="tel"
                placeholder="Contact Number"
                value={currentHandler.contact_No}
                onChange={handleInputChange}
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-600 hover:bg-red-500"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-700 hover:bg-green-600">
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

export default CompostHandlerSection;
