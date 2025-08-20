import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaEye, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import './Products.css';
import ProductCard from '../components/ProductCard/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  const { addToCart } = useCart();

  useEffect(() => {
    // When the component mounts or searchParams change, update filters.
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    setFilters({
      category,
      brand,
      minPrice,
      maxPrice,
      sort
    });
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Always set page to 1
  }, [searchParams]);

  const cleanFilters = {};
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== '' && val !== null && val !== undefined) {
      cleanFilters[key] = val;
    }
  });

  const params = new URLSearchParams({
    page: pagination.currentPage,
    limit: 12,
    ...cleanFilters
  });


  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== '' && val !== null && val !== undefined) {
          cleanFilters[key] = val;
        }
      });

      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...cleanFilters
      });


      console.log('Fetching products with params:', params);


      const response = await axios.get(`/api/products?${params}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/products/brands');
      setBrands(response.data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    // Optional: Show a toast notification here
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );

  const activeFiltersCount = Object.values(filters).filter(
    val => val !== '' && val !== 'newest'
  ).length;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      {/* Hero Banner */}
      <div className="products-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Luxury Fragrance Collection</h1>
            <p>Discover scents that define moments and create memories</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-header">
          <button
            className="btn-filter-toggle"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <FaFilter /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
            <div className="filter-header">
              <h3>Filters</h3>
              <button
                className="btn-close-filters"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <IoMdClose />
              </button>
            </div>

            <div className="filter-section">
              {activeFiltersCount > 0 && (
                <button className="btn-reset-filters" onClick={resetFilters}>
                  Clear All Filters
                </button>
              )}

              <div className="filter-group">
                <label>Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="select-filter"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="select-filter"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="select-filter"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="price-input"
                  />
                  <span className="price-separator">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Content */}
          <div className="products-content">
            {/* Results Summary */}
            <div className="results-summary">
              <p>
                Showing {products.length} of {pagination.totalProducts} products
                {activeFiltersCount > 0 && ' (filtered)'}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="no-products">
                <div className="no-products-content">
                  <h3>No fragrances match your search</h3>
                  <p>Try adjusting your filters or browse our full collection</p>
                  <button className="btn-reset" onClick={resetFilters}>
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="page-btn prev-next"
                    >
                      <FaChevronLeft /> Previous
                    </button>

                    <div className="page-numbers">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`page-btn ${pageNum === pagination.currentPage ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                        <span className="page-ellipsis">...</span>
                      )}

                      {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                        <button
                          onClick={() => handlePageChange(pagination.totalPages)}
                          className={`page-btn ${pagination.totalPages === pagination.currentPage ? 'active' : ''}`}
                        >
                          {pagination.totalPages}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="page-btn prev-next"
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;