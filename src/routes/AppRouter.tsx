import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../features/auth/context/AuthContext";
import { USER_ROLES } from "../config/constants";
import Loader from "../components/common/Loader";

// --- LAZY LOADING DE PÁGINAS ---
const LoginPage = React.lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(
  () => import("../features/auth/pages/RegisterPage")
);
const ProductsPage = React.lazy(
  () => import("../features/shop/products/pages/ProductsPage")
);
const BlogPage = React.lazy(() => import("../features/blog/pages/BlogPage"));
const CreateBlogPage = React.lazy(
  () => import("../features/blog/pages/CreateBlogPage")
);
const EditBlogPage = React.lazy(
  () => import("../features/blog/pages/EditBlogPage")
);
const HomePage = React.lazy(() => import("../features/home/HomePage"));
const OrdersPage = React.lazy(
  () => import("../features/shop/orders/pages/OrdersPage")
);
const CreateProductPage = React.lazy(
  () => import("../features/shop/products/pages/CreateProductPage")
);
const ProfilePage = React.lazy(
  () => import("../features/auth/pages/ProfilePage")
);
const ProfileUpdatePage = React.lazy(
  () => import("../features/auth/pages/ProfileUpdatePage")
);
const BlogDetailPage = React.lazy(
  () => import("../features/blog/pages/BlogDetailPage")
);
const CartPage = React.lazy(
  () => import("../features/shop/cart/pages/CartPage")
);
const ContactPage = React.lazy(() => import("../features/contact/ContactPage"));
const KitsPage = React.lazy(
  () => import("../features/shop/kits/pages/KitsPage")
);

const ProtectedRoute = ({
  children,
  requiredRoles,
}: {
  children: React.ReactElement;
  requiredRoles?: string[];
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader message="Verificando sesión..." />;
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
    // Envolvemos todo en Suspense para mostrar el Loader mientras se descargan los trozos de código
    <Suspense fallback={<Loader message="Cargando página..." />}>
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
          {/* Rutas de Usuario */}
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* RUTAS DE PERFIL */}
          <Route path="profile">
            <Route
              index
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
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
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
