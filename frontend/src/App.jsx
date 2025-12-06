import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminServices from './pages/admin/Services';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerOrders from './pages/customer/Orders';
import CustomerOrderDetail from './pages/customer/OrderDetail';
import CustomerNewOrder from './pages/customer/NewOrder';
import CustomerProfile from './pages/customer/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#333', color: '#fff' },
            success: { iconTheme: { primary: '#c9a227', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute allowedRoles={['admin']}><AdminOrderDetail /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['admin']}><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['pelanggan']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute allowedRoles={['pelanggan']}><CustomerOrders /></ProtectedRoute>} />
          <Route path="/customer/orders/:id" element={<ProtectedRoute allowedRoles={['pelanggan']}><CustomerOrderDetail /></ProtectedRoute>} />
          <Route path="/customer/new-order" element={<ProtectedRoute allowedRoles={['pelanggan']}><CustomerNewOrder /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute allowedRoles={['pelanggan']}><CustomerProfile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
