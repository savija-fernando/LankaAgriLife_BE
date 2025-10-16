import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/components/ui/Card';
import { Input } from '../../../components/components/ui/Input';
import { Edit, Trash, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/components/ui/Button';
import { GiMilkCarton } from "react-icons/gi";
import {
  getAllProduct,
  addProduct,
  updateProduct,
  deleteProductItem
} from '../../../api/productAPI';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    product_id: '',
    storageDetails: '',
    type: '',
    quantity: '',
    CollectionDate: '',
    processedStatus: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProduct();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Failed to load products.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateProduct(editMode, currentProduct);
        alert('Product updated successfully');
      } else {
        await addProduct(currentProduct);
        alert('Product added successfully');
      }

      setIsModalOpen(false);
      setEditMode(null);
      setCurrentProduct({
        product_id: '',
        storageDetails: '',
        type: '',
        quantity: '',
        CollectionDate: '',
        processedStatus: '',
      });
      fetchProducts();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product.");
    }
  };

  const handleEdit = (id) => {
    const product = products.find(p => p.product_id === id);
    if (!product) return;

    setCurrentProduct({
      ...product,
      CollectionDate: product.CollectionDate ? product.CollectionDate.slice(0, 10) : '',
      quantity: product.quantity || '',
    });
    setEditMode(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProductItem(id);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2">
          <GiMilkCarton className="w-8 h-8 text-green-600" /> Products
        </h2>
        <Button
          onClick={() => {
            setCurrentProduct({
              product_id: '',
              storageDetails: '',
              type: '',
              quantity: '',
              CollectionDate: '',
              processedStatus: '',
            });
            setEditMode(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-500 rounded-full px-4 py-2"
        >
          <PlusCircle className="w-5 h-5" /> Add Product
        </Button>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <Card key={product.product_id} className="relative bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition">
            {/* Edit and Delete Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => handleEdit(product.product_id)} className="text-yellow-500 hover:text-yellow-700 cursor-pointer transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(product.product_id)} className="text-red-600 hover:text-red-800 cursor-pointer transition-colors">
                <Trash className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-semibold">{product.type}</h3>
            <p><strong>Product ID:</strong> {product.product_id}</p>
            <p><strong>Storage:</strong> {product.storageDetails}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>Collection Date:</strong> {product.CollectionDate ? new Date(product.CollectionDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {product.processedStatus}</p>
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
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
  {!editMode && (
    <div>
      <label className="block text-blue-700 font-semibold mb-1">Product ID:</label>
      <Input
        name="product_id"
        placeholder="Enter Product ID"
        value={currentProduct.product_id}
        onChange={handleInputChange}
      />
    </div>
  )}

  <div>
    <label className="block text-blue-700 font-semibold mb-1">Type:</label>
    <Input
      name="type"
      placeholder="Enter Type"
      value={currentProduct.type}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-blue-700 font-semibold mb-1">Storage Details:</label>
    <Input
      name="storageDetails"
      placeholder="Enter Storage Details"
      value={currentProduct.storageDetails}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-blue-700 font-semibold mb-1">Quantity:</label>
    <Input
      name="quantity"
      placeholder="Enter Quantity"
      value={currentProduct.quantity}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-blue-700 font-semibold mb-1">Collection Date:</label>
    <Input
      name="CollectionDate"
      type="date"
      value={currentProduct.CollectionDate}
      onChange={handleInputChange}
    />
  </div>

  <div>
    <label className="block text-blue-700 font-semibold mb-1">Processed Status:</label>
    <Input
      name="processedStatus"
      placeholder="Enter Processed Status"
      value={currentProduct.processedStatus}
      onChange={handleInputChange}
    />
  </div>

  <div className="flex justify-end gap-2">
    <Button onClick={() => setIsModalOpen(false)} className="bg-red-600">Cancel</Button>
    <Button type="submit" className="bg-blue-600">
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

export default ProductsSection;
