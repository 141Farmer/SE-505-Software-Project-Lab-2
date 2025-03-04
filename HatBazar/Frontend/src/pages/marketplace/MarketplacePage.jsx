import React, { useState, useEffect } from 'react';
import { Star, X, Package, User, Truck, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const MarketPlace = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    product_detail: '',
    image: null,
    price: '',
    stock: '',
    production_procedure: '',
  });

  useEffect(() => {
    fetchProducts();
    checkUserRole();
  }, []);

  useEffect(() => {
    // Filter products whenever the search term or products change
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/marketplace', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch('http://127.0.0.1:8000/user-role', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserRole(data.role);
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewProduct((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('package_detail', newProduct.package_detail);
    formData.append('image', newProduct.image);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('production_procedure', newProduct.production_procedure);

    try {
      const response = await fetch('http://127.0.0.1:8000/marketplace/addproduct', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setIsAddModalOpen(false);
        fetchProducts(); // Refresh the product list
        window.location.reload(); // Redirect and refresh to /marketplace
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error submitting new product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-green-100">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agricultural Products</h1>
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {userRole === 'farm' && (
          <button
            className="mb-4 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> 
            Add Product
          </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
            >
              <img
                src={product.product_image}
                alt={product.product_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.product_name}</h3>
                <Star className="w-4 h-4 text-yellow-400" /> {product.rating || 'No rating'}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-2xl font-bold text-green-600">{product.unit_price} tk</span>
                  <span className={product.stock_amount > 0 ? 'text-green-700' : 'text-red-700'}>
                    {product.stock_amount > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {/* Package Detail */}
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Package: </span>
                  {product.package_detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsAddModalOpen(false)} />
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
              <form onSubmit={handleAddProductSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="package_detail" className="block text-sm font-medium text-gray-700">
                    Package Details
                  </label>
                  <textarea
                    id="package_detail"
                    name="package_detail"
                    value={newProduct.package_detail}
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Product Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="production_procedure" className="block text-sm font-medium text-gray-700">
                    Production Procedure
                  </label>
                  <textarea
                    id="production_procedure"
                    name="production_procedure"
                    value={newProduct.production_procedure}
                    onChange={handleAddProductChange}
                    required
                    className="mt-2 w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)} />
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative z-10 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6">{selectedProduct.product_name}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.product_image}
                    alt={selectedProduct.product_name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">Farm: {selectedProduct.farm_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">Location: {selectedProduct.farm_addresss}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-600">Stock: {selectedProduct.stock_amount} units</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Production Procedure</h3>
                  <p className="text-gray-600">{selectedProduct.production_procedure}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div>
                  <span className="text-xl font-bold text-green-600">${selectedProduct.unit_price}</span>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;