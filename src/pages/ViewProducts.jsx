import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import "./AdminDashboard.css";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      alert("Product deleted!");
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error('Error deleting product:', err);
      alert("Failed to delete product.");
    }
  };

  // Edit handler
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl || ''
    });
  };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="products-container">
        <h2 className="section-title">Product List</h2>
        <button
          onClick={() => {
            setShowAddModal(true);
            setFormData({ name: '', price: '', description: '', imageUrl: '' });
          }}
          className="add-product-btn"
        >
          Add Product
        </button>

        {products.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          <table className="products-table products-table-list">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                        alt={product.name}
                        className="product-img"
                      />
                    ) : (
                      <span style={{color: '#888', fontStyle: 'italic'}}>No Image</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.description ? product.description.slice(0, 60) + '...' : ''}</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="edit">Edit</button>
                    <button onClick={() => deleteProduct(product._id)} className="delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h2>Edit Product</h2>
              <form
                encType="multipart/form-data"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formDataObj = new FormData(form);
                  formDataObj.set("name", formData.name);
                  formDataObj.set("price", formData.price);
                  formDataObj.set("description", formData.description);
                  if (form.image.files[0]) {
                    formDataObj.set("image", form.image.files[0]);
                  }
                  try {
                    const response = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
                      method: "PATCH",
                      body: formDataObj,
                    });
                    if (response.ok) {
                      await fetchProducts();
                      setEditingProduct(null);
                    } else {
                      const errData = await response.json();
                      alert(`Failed to update product: ${errData.message || 'Unknown error'}`);
                    }
                  } catch (error) {
                    alert("Error updating product. Check console for details.");
                    console.error("Error updating product:", error);
                  }
                }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Price"
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                />
                <div className="modal-actions">
                  <button
                    className="cancel"
                    type="button"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                  <button className="save" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="edit-modal">
            <div className="edit-modal-content">
              <h2>Add New Product</h2>
              <form
                encType="multipart/form-data"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formDataObj = new FormData(form);
                  formDataObj.set("name", formData.name);
                  formDataObj.set("price", formData.price);
                  formDataObj.set("description", formData.description);
                  if (form.image.files[0]) {
                    formDataObj.set("image", form.image.files[0]);
                  }
                  try {
                    const response = await fetch(`http://localhost:5000/api/products`, {
                      method: "POST",
                      body: formDataObj,
                    });
                    if (response.ok) {
                      await fetchProducts();
                      setFormData({ name: '', price: '', description: '', imageUrl: '' });
                      setShowAddModal(false);
                    } else {
                      const errData = await response.json();
                      alert(`Failed to add product: ${errData.message || 'Unknown error'}`);
                    }
                  } catch (error) {
                    alert("Error adding product. Check console for details.");
                    console.error("Error adding product:", error);
                  }
                }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  required
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Price"
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                />
                <div className="modal-actions">
                  <button
                    className="cancel"
                    type="button"
                    onClick={() => { setShowAddModal(false); setFormData({ name: '', price: '', description: '', imageUrl: '' }); }}
                  >
                    Cancel
                  </button>
                  <button className="save" type="submit">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
