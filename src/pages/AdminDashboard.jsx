import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminNavbar = ({ onLogout }) => (
  <div className="admin-header">
    <div className="admin-header-left">
      <img src="/logo.png" alt="Logo" className="admin-logo" />
      <h1 className="admin-title">Admin Dashboard</h1>
    </div>
    <div className="admin-links">
      <Link to="/products">View Products</Link>
      <Link to="/orders">View Orders</Link>
      <Link to="/analytics">Analytics</Link>
      <button className="logout-btn" type="button" onClick={onLogout}>Logout</button>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: 0, stock: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price, stock: product.stock });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
      } else {
        console.error("❌ Failed to delete product");
      }
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <AdminNavbar onLogout={handleLogout} />

      <div className="welcome-section">
        <h2>Welcome Admin <span role="img" aria-label="wave">👋</span></h2>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <p>All Products</p>
          <h3>{products.length}</h3>
        </div>
        <div className="stats-card">
          <p>Out of Stock</p>
          <h3>{products.filter(p => p.stock === 0).length}</h3>
        </div>
        <div className="stats-card">
          <p>Limited Stock</p>
          <h3>{products.filter(p => p.stock > 0 && p.stock <= 5).length}</h3>
        </div>
        <div className="stats-card">
          <p>Other Stock</p>
          <h3>{products.filter(p => p.stock > 5).length}</h3>
        </div>
      </div>

      <h2 className="section-title">All Products</h2>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-products">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    {console.log('Product object:', product)}
                    {console.log('Product imageUrl:', product.imageUrl)}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`}
                        alt={product.name}
                      />
                    ) : (
                      <span style={{color: '#888', fontStyle: 'italic'}}>No Image</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td className="actions">
                    <button className="edit" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingProduct ? (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Product</h2>
            <form
              encType="multipart/form-data"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingProduct) return;
                const form = e.target;
                const formDataObj = new FormData(form);
                formDataObj.set("name", formData.name);
                formDataObj.set("price", formData.price);
                formDataObj.set("stock", formData.stock);
                // Only append image if a new file is selected
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
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name"
              />
              <input
                type="number"
                name="price"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Stock"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
              />
              <div className="modal-actions">
                <button className="cancel" type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                <button className="save" type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;
