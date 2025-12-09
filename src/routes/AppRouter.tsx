// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ProductsPage from "../features/shop/ProductsPage";
import BlogPage from "../features/blog/BlogPage";
import CreateBlogPage from "../features/blog/CreateBlogPage";
import EditBlogPage from "../features/blog/EditBlogPage";
import HomePage from "../features/home/HomePage";
import OrdersPage from "../features/orders/OrdersPage";
import CreateProductPage from "../features/orders/CreateProductPage";
import ProfilePage from "../features/auth/ProfilePage"; // Página de Visualización
import ProfileUpdatePage from "../features/auth/ProfileUpdatePage"; // Página de Edición (renombrada)
import BlogDetailPage from "../features/blog/BlogDetailPage";
import ContactPage from "../features/contact/ContactPage";
import KitsPage from "../features/kits/KitsPage";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../config/constants";

// Componente para proteger rutas privadas y verificar roles
const ProtectedRoute = ({
  children,
  requiredRoles,
}: {
  children: React.ReactElement;
  requiredRoles?: string[];
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  if (requiredRoles && !requiredRoles.includes(user?.role || USER_ROLES.USER)) {
    return (
      <Navigate
        to="/"
        replace
        state={{ message: "Acceso denegado. Rol insuficiente." }}
      />
    );
  }

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 📌 RUTAS PÚBLICAS */}
        <Route index element={<HomePage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="tienda" element={<ProductsPage />} />
        <Route path="kits" element={<KitsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* TODO: Agregar ruta Contacto */}

        {/* 📌 RUTAS PRIVADAS */}
        <Route
          path="blog/edit/:id"
          element={
            <ProtectedRoute
              requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MODERATOR]}
            >
              <EditBlogPage />
            </ProtectedRoute>
          }
        />
        {/* Rutas de Usuario (Requiere solo Login) */}
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* RUTAS DE PERFIL */}
        <Route path="profile">
          {/* /profile muestra la página de visualización */}
          <Route
            index
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* /profile/edit muestra el formulario de edición */}
          <Route
            path="edit"
            element={
              <ProtectedRoute>
                <ProfileUpdatePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rutas de Moderación/Admin */}
        <Route
          path="blog/new"
          element={
            <ProtectedRoute
              requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MODERATOR]}
            >
              <CreateBlogPage />
            </ProtectedRoute>
          }
        />
        {/* ⬅️ NUEVA RUTA PARA CREAR PRODUCTO ⬅️ */}
        <Route
          path="products/new"
          element={
            <ProtectedRoute
              requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.MODERATOR]}
            >
              <CreateProductPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="contacto" element={<ContactPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
