import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import './Admin.css';
import api from '../../utils/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    oldPrice: '',
    newPrice: '',
    category: '',
    brand: '',
    volume: '',
    stock: '',
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // Default categories and brands for new stores
  const defaultCategories = ['Men', 'Women', 'Unisex', 'Limited Edition', 'Seasonal'];
  const defaultBrands = ['Vampire Blood', 'Fantasy', 'Good Girl', 'Creed aventus', 'Gucci flora'];
  const [uploading, setUploading] = useState(false);
  
  // Function to create preview URLs for File objects
  const createImagePreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file; // If it's already a URL string
  };

  useEffect(() => {
    // Add a small delay to prevent rate limiting issues
    const timer = setTimeout(() => {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }, 100);
    
    // Cleanup function to revoke object URLs and clear timer
    return () => {
      clearTimeout(timer);
      if (formData.images) {
        formData.images.forEach(image => {
          if (image instanceof File) {
            URL.revokeObjectURL(createImagePreview(image));
          }
        });
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      console.log('Products response:', response.data);
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        console.error('Invalid products data:', response.data);
        setProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.status === 429) {
        // Rate limited - retry after a delay
        setTimeout(() => fetchProducts(), 2000);
        return;
      }
      toast.error('Error fetching products');
      setLoading(false);
    }
  };

const fetchCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    if (response.data.success && Array.isArray(response.data.categories)) {
      // Combine API categories with defaults, remove duplicates
      const combinedCategories = [...new Set([
        ...defaultCategories,
        ...response.data.categories
      ])];
      setCategories(combinedCategories);
    } else {
      setCategories(defaultCategories);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    setCategories(defaultCategories);
  }
};

  const fetchBrands = async () => {
  try {
    const response = await api.get('/products/brands');
    if (response.data.success && Array.isArray(response.data.brands)) {
      // Combine API brands with defaults, remove duplicates
      const combinedBrands = [...new Set([
        ...defaultBrands,
        ...response.data.brands
      ])];
      setBrands(combinedBrands);
    } else {
      setBrands(defaultBrands);
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    setBrands(defaultBrands);
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      // Store the actual File objects in formData
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
      toast.success('Images added successfully');
    } catch (error) {
      toast.error('Error adding images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create FormData for the product submission
      const productFormData = new FormData();
      
      // Add all the text fields
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('oldPrice', formData.oldPrice);
      productFormData.append('newPrice', formData.newPrice);
      productFormData.append('category', formData.category);
      productFormData.append('brand', formData.brand);
      productFormData.append('volume', formData.volume);
      productFormData.append('stock', formData.stock);
      
      // Add image files if they exist
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            // If it's a File object, append it directly
            productFormData.append('images', image);
          }
          // If it's a URL string, we don't append it - the backend will keep existing images
        });
      }
      
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', productFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      oldPrice: product.oldPrice || '',
      newPrice: product.price || '', // Map price to newPrice for the form
      category: product.category || '',
      brand: product.brand || '',
      volume: product.volume || '',
      stock: product.stock || '',
      images: Array.isArray(product.images) ? product.images.map(img => img.url || img) : []
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${productId}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      oldPrice: '',
      newPrice: '',
      category: '',
      brand: '',
      volume: '',
      stock: '',
      images: []
    });
  };

  const openAddForm = () => {
    setShowForm(true);
    setEditingProduct(null);
    resetForm();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="container">
        <div className="admin-header">
          <h1>Products Management</h1>
          <button className="btn btn-primary" onClick={openAddForm}>
            <FaPlus /> Add New Product
          </button>
        </div>

        {showForm && (
          <div className="product-form-overlay">
            <div className="product-form">
              <div className="form-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={closeForm}>
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Brand</option>
                      {Array.isArray(brands) && brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Volume</label>
                    <input
                      type="text"
                      name="volume"
                      value={formData.volume}
                      onChange={handleInputChange}
                      placeholder="e.g., 50ml, 100ml"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Old Price *</label>
                    <input
                      type="number"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Price *</label>
                    <input
                      type="number"
                      name="newPrice"
                      value={formData.newPrice}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Product description..."
                  />
                </div>

                <div className="form-group">
                  <label>Product Images</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <span className="uploading">Uploading...</span>}
                  </div>
                  
                  {Array.isArray(formData.images) && formData.images.length > 0 && (
                    <div className="image-preview">
                      {formData.images.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={createImagePreview(image)} alt={`Product ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => removeImage(index)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="products-grid">
          {Array.isArray(products) && products.map(product => (
            <div key={product._id} className="product-card">
                             <div className="product-image">
                 {Array.isArray(product.images) && product.images.length > 0 ? (
                   <img src={product.images[0].url || product.images[0]} alt={product.name || 'Product'} />
                 ) : (
                   <div className="no-image">
                     <FaImage />
                     <span>No Image</span>
                   </div>
                 )}
               </div>
              
              <div className="product-info">
                <h3>{product.name || 'Unnamed Product'}</h3>
                <p className="category">{product.category || 'No Category'} • {product.brand || 'No Brand'}</p>
                <div className="pricing">
                  <span className="old-price">${product.oldPrice || 0}</span>
                  <span className="new-price">${product.price || 0}</span>
                  {product.oldPrice && product.price && product.oldPrice > product.price && (
                    <span className="discount">
                      {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className="stock">Stock: {product.stock || 0}</p>
                <p className="volume">{product.volume || 'No volume'}</p>
              </div>
              
              <div className="product-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => handleEdit(product)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!Array.isArray(products) || products.length === 0) && (
          <div className="no-products">
            <p>No products found. Add your first product to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
