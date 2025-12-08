import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminServices from './pages/admin/Services.jsx';
import AdminOrders from './pages/admin/Orders.jsx';
import AdminOrderDetail from './pages/admin/OrderDetail.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminReports from './pages/admin/Reports.jsx';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard.jsx';
import CustomerOrders from './pages/customer/Orders.jsx';
import CustomerOrderDetail from './pages/customer/OrderDetail.jsx';
import CustomerNewOrder from './pages/customer/NewOrder.jsx';
import CustomerProfile from './pages/customer/Profile.jsx';

function App() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin/dashboard" : "/customer/dashboard"} /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to={isAdmin ? "/admin/dashboard" : "/customer/dashboard"} /> : <Signup />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly><AdminOrderDetail /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReports /></ProtectedRoute>} />

      {/* Customer Routes */}
      <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
      <Route path="/customer/orders/new" element={<ProtectedRoute><CustomerNewOrder /></ProtectedRoute>} />
      <Route path="/customer/orders/:id" element={<ProtectedRoute><CustomerOrderDetail /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;