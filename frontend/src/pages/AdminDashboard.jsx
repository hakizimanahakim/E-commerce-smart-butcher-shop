import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // Default to orders for all users
  const [user, setUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // Axios instance with auth
  const api = axios.create({ baseURL: 'http://localhost:3001/api' });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Set default tab based on user role
    if (parsedUser.role === 'admin') {
      setActiveTab('overview');
    } else {
      setActiveTab('orders');
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateDeliveryStatus = async (orderId, deliveryStatus) => {
    try {
      await api.put(`/orders/${orderId}/delivery`, { delivery_status: deliveryStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowAddUserModal(false);
      setNewUser({ username: '', password: '', role: 'user' });
      fetchData();
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchData();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchData();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(error.response?.data?.error || 'Failed to delete product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description
      });
      setShowEditProductModal(false);
      setEditingProduct(null);
      fetchData();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.response?.data?.error || 'Failed to update product');
    }
  };

  const handleGenerateInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const generateInvoicePDF = () => {
    if (!selectedOrder) return;

    // Safely parse items
    let orderItems = [];
    try {
      if (typeof selectedOrder.items === 'string') {
        orderItems = JSON.parse(selectedOrder.items);
      } else if (Array.isArray(selectedOrder.items)) {
        orderItems = selectedOrder.items;
      } else {
        orderItems = [];
      }
    } catch (error) {
      console.error('Error parsing order items:', error);
      orderItems = [];
    }

    // Create invoice content with improved print styling
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${selectedOrder.id}</title>
        <meta charset="UTF-8">
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
          }

          body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            margin: 20px;
            color: #333;
            line-height: 1.6;
            font-size: 14px;
          }

          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }

          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 20px;
          }

          .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .company-info {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
          }

          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin: 40px 0;
            gap: 40px;
          }

          .invoice-info, .customer-info {
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
          }

          .invoice-info h3, .customer-info h3 {
            color: #dc2626;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 18px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 5px 0;
            border-bottom: 1px dotted #ddd;
          }

          .detail-label {
            font-weight: bold;
            color: #555;
          }

          .detail-value {
            color: #333;
          }

          .items-section {
            margin: 40px 0;
          }

          .items-title {
            font-size: 20px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 15px 12px;
            text-align: left;
          }

          .items-table th {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 13px;
          }

          .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          .items-table tr:hover {
            background-color: #e9ecef;
          }

          .items-table td {
            font-size: 14px;
          }

          .quantity-col, .price-col, .total-col {
            text-align: right;
            font-weight: 500;
          }

          .total-section {
            text-align: right;
            margin: 40px 0;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #dc2626;
          }

          .total-row {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .footer {
            text-align: center;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #eee;
            color: #666;
            background: #f8f9fa;
            padding: 30px;
            border-radius: 8px;
          }

          .footer-title {
            font-size: 18px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
          }

          .footer-text {
            font-size: 14px;
            margin: 5px 0;
          }

          .print-date {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="print-date">Printed: ${new Date().toLocaleString()}</div>

        <div class="invoice-container">
          <div class="header">
            <div class="company-name">🥩 One Genesis Butcher Shop</div>
            <div class="company-info">Premium Quality Meats</div>
            <div class="company-info">Kigali, Rwanda</div>
            <div class="company-info">Phone: +250 123 456 789</div>
            <div class="company-info">Email: onegenesisinfo@gmail.com</div>
          </div>

          <div class="invoice-details">
            <div class="invoice-info">
              <h3>Invoice Information</h3>
              <div class="detail-row">
                <span class="detail-label">Invoice #:</span>
                <span class="detail-value">#${selectedOrder.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value">${selectedOrder.transaction_id || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(selectedOrder.created_at).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #28a745; font-weight: bold;">${selectedOrder.status.toUpperCase()}</span>
              </div>
            </div>

            <div class="customer-info">
              <h3>Customer Information</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${selectedOrder.customer_name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${selectedOrder.customer_phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${selectedOrder.customer_email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${selectedOrder.customer_address || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="items-section">
            <div class="items-title">Order Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 40%;">Item Description</th>
                  <th style="width: 15%;" class="quantity-col">Quantity</th>
                  <th style="width: 20%;" class="price-col">Unit Price</th>
                  <th style="width: 25%;" class="total-col">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${orderItems.map(item => `
                  <tr>
                    <td><strong>${item.name || 'Unknown Item'}</strong></td>
                    <td class="quantity-col">${item.quantity || 0} kg</td>
                    <td class="price-col">${(item.price || 0).toLocaleString()} ${selectedOrder.currency || 'RWF'}</td>
                    <td class="total-col"><strong>${((item.price || 0) * (item.quantity || 0)).toLocaleString()} ${selectedOrder.currency || 'RWF'}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="total-section">
            <div class="total-row">
              Grand Total: ${(selectedOrder.total || 0).toLocaleString()} ${selectedOrder.currency || 'RWF'}
            </div>
          </div>

          <div class="footer">
            <div class="footer-title">Thank You for Your Business!</div>
            <div class="footer-text">One Genesis Butcher Shop</div>
            <div class="footer-text">Your trusted source for premium quality meats</div>
            <div class="footer-text">We appreciate your continued patronage</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Open new window and print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert('Please allow popups to generate the invoice');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-white text-2xl">🥩</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
                  One Genesis Admin
                </h1>
                <p className="text-gray-400 text-lg font-medium">Butcher Shop Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* User Info Card */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3">
                <div className="text-right">
                  <p className="text-white font-bold text-lg">Welcome, {user?.username}</p>
                  <div className="flex items-center justify-end space-x-2">
                    <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                    <p className="text-gray-400 text-sm capitalize font-medium">{user?.role} Access</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
              >
                <span className="flex items-center space-x-2">
                  <span>🚪</span>
                  <span>Logout</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Modern Sidebar */}
        <nav className="w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-r border-gray-700/50 p-6">
          <div className="space-y-3">
            {/* Admin-only navigation items */}
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`group w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">📊</span>
                    <div>
                      <div className="font-semibold">Overview</div>
                      <div className="text-xs opacity-75">Dashboard & Analytics</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`group w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">🥩</span>
                    <div>
                      <div className="font-semibold">Products</div>
                      <div className="text-xs opacity-75">Manage Inventory</div>
                    </div>
                  </div>
                </button>
              </>
            )}

            {/* Orders - available to all users */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`group w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-gray-700/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-semibold">Orders</div>
                  <div className="text-xs opacity-75">Track & Manage</div>
                </div>
              </div>
            </button>

            {/* Admin-only Users management */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`group w-full text-left px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold">Users</div>
                    <div className="text-xs opacity-75">User Management</div>
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="text-center">
                <div className="text-yellow-400 text-2xl mb-2">⭐</div>
                <div className="text-white font-semibold text-sm">System Status</div>
                <div className="text-green-400 text-xs">All Systems Online</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Modern Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && user?.role === 'admin' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Products</p>
                      <p className="text-2xl font-bold text-white">{products.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">🥩</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{orders.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">📦</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue</p>
                      <p className="text-2xl font-bold text-white">
                        {orders.reduce((total, order) => total + (order.total || 0), 0).toLocaleString()} RWF
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && user?.role === 'admin' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Products Management</h2>
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-800 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={`http://localhost:3001${product.image}`}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42pPC90ZXh0Pgo8L3N2Zz4K';
                                }}
                              />
                              <span className="text-white font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-yellow-400 font-medium">
                            {product.price} RWF/kg
                          </td>
                          <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                            {product.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-900/20 transition-all duration-200 font-medium"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-900/20 transition-all duration-200 font-medium"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Orders Management</h2>
              {orders.length === 0 ? (
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📦</span>
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No orders found</p>
                  <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Delivery Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-800 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-white font-medium">{order.customer_name}</div>
                                <div className="text-gray-400 text-sm">{order.customer_email}</div>
                                <div className="text-gray-400 text-sm">{order.customer_phone}</div>
                                {order.customer_address && (
                                  <div className="text-gray-500 text-xs mt-1 max-w-xs truncate" title={order.customer_address}>
                                    📍 {order.customer_address}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-yellow-400 font-medium">
                              {order.total} {order.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'completed' ? 'bg-green-900 text-green-300' :
                                order.status === 'paid' ? 'bg-blue-900 text-blue-300' :
                                order.status === 'processing' ? 'bg-yellow-900 text-yellow-300' :
                                order.status === 'pending' ? 'bg-gray-900 text-gray-300' :
                                'bg-red-900 text-red-300'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.delivery_status === 'delivered' ? 'bg-green-900 text-green-300' :
                                order.delivery_status === 'in_progress' ? 'bg-yellow-900 text-yellow-300' :
                                'bg-gray-900 text-gray-300'
                              }`}>
                                {order.delivery_status === 'delivered' ? 'Delivered' : 'In Progress'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-2">
                                {user?.role === 'admin' && (
                                  <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-yellow-400"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                )}

                                {/* Delivery Status Button */}
                                <button
                                  onClick={() => updateDeliveryStatus(
                                    order.id,
                                    order.delivery_status === 'delivered' ? 'in_progress' : 'delivered'
                                  )}
                                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors duration-200 ${
                                    order.delivery_status === 'delivered'
                                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                      : 'bg-green-600 hover:bg-green-700 text-white'
                                  }`}
                                >
                                  {order.delivery_status === 'delivered' ? 'Mark In Progress' : 'Mark Delivered'}
                                </button>

                                {/* Invoice Generation Button - Admin Only */}
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={() => handleGenerateInvoice(order)}
                                    className="px-3 py-1 text-xs rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 flex items-center space-x-1"
                                  >
                                    <span>📄</span>
                                    <span>Invoice</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && user?.role === 'admin' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Users Management</h2>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  + Add User
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-800 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'admin' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.id !== 1 && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-80"
            onClick={() => setShowAddUserModal(false)}
          />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-80"
            onClick={() => setShowEditProductModal(false)}
          />
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Price (RWF/kg) *
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows="3"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 resize-none"
                  placeholder="Enter product description"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal with Scroll */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-80"
            onClick={() => setShowInvoiceModal(false)}
          />
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <span className="text-3xl">📄</span>
                <span>Generate Invoice</span>
              </h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {/* Invoice Preview */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-6">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-red-500 mb-2">🥩 One Genesis Butcher Shop</div>
                <div className="text-gray-400">Invoice Preview</div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-white font-semibold mb-3 border-b border-gray-600 pb-2">Invoice Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Invoice #:</span>
                      <span className="text-white font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction ID:</span>
                      <span className="text-white font-medium">{selectedOrder.transaction_id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-medium capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 border-b border-gray-600 pb-2">Customer Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white font-medium">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium">{selectedOrder.customer_email}</span>
                    </div>
                    {selectedOrder.customer_address && (
                      <div>
                        <span className="text-gray-400">Address:</span>
                        <div className="text-white font-medium text-xs mt-1">{selectedOrder.customer_address}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 border-b border-gray-600 pb-2">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left text-gray-400 py-2">Item</th>
                        <th className="text-right text-gray-400 py-2">Qty</th>
                        <th className="text-right text-gray-400 py-2">Price</th>
                        <th className="text-right text-gray-400 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let orderItems = [];
                        try {
                          if (typeof selectedOrder.items === 'string') {
                            orderItems = JSON.parse(selectedOrder.items);
                          } else if (Array.isArray(selectedOrder.items)) {
                            orderItems = selectedOrder.items;
                          }
                        } catch (error) {
                          console.error('Error parsing items for preview:', error);
                          orderItems = [];
                        }

                        return orderItems.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700/50">
                            <td className="text-white py-2">{item.name || 'Unknown Item'}</td>
                            <td className="text-white py-2 text-right">{item.quantity || 0} kg</td>
                            <td className="text-white py-2 text-right">{item.price || 0} {selectedOrder.currency || 'RWF'}</td>
                            <td className="text-white py-2 text-right font-medium">{((item.price || 0) * (item.quantity || 0)).toLocaleString()} {selectedOrder.currency || 'RWF'}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="text-right border-t border-gray-600 pt-4">
                <div className="text-2xl font-bold text-yellow-400">
                  Total: {selectedOrder.total} {selectedOrder.currency}
                </div>
              </div>
            </div>
            </div>

            {/* Fixed Footer with Action Buttons */}
            <div className="border-t border-gray-700/50 p-6">
              <div className="flex space-x-4">
                <button
                  onClick={generateInvoicePDF}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🖨️</span>
                    <span>Print Invoice</span>
                  </span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;