import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RoleSwitcherBanner from './components/RoleSwitcherBanner';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import ClientMenuView from './pages/ClientMenuView';
import DishDetailPage from './pages/DishDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import SuperadminDashboard from './pages/SuperadminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#dce1e7] text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
          
          {/* Demo Quick Role Switcher Banner */}
          <RoleSwitcherBanner />

          {/* Single Top Navigation Bar (Red Header + Yellow Category Nav) */}
          <Navbar />

          {/* Main Content Area */}
          <div className="flex-1">
            <Routes>
              {/* Default Redirect to Branch 1 Menu */}
              <Route path="/" element={<Navigate to="/branch/1" replace />} />

              {/* Client Menu View */}
              <Route path="/branch/:branchId" element={<ClientMenuView />} />

              {/* Dedicated Single Dish Detail Page Route */}
              <Route path="/branch/:branchId/dish/:foodId" element={<DishDetailPage />} />
              <Route path="/dish/:foodId" element={<DishDetailPage />} />

              {/* Branch Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Superadmin Console */}
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoute allowedRoles={['Superadmin']}>
                    <SuperadminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* User Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/branch/1" replace />} />
            </Routes>
          </div>

          {/* Site Footer */}
          <Footer />

          {/* Global Shopping Cart Side Drawer */}
          <CartDrawer />

        </div>
      </Router>
    </AuthProvider>
  );
}
