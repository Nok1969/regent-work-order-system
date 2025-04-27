import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Eagerly load Index and Login since they're critical paths
import Index from "./pages/Index";
import Login from "./pages/Login";

// Lazy load other pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Repairs = lazy(() => import("./pages/Repairs"));
const CreateRepair = lazy(() => import("./pages/CreateRepair"));
const RepairDetail = lazy(() => import("./pages/RepairDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Users = lazy(() => import("./pages/Users"));
const Statistics = lazy(() => import("./pages/Statistics"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// PrivateRoute component for handling authentication
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>กำลังตรวจสอบการเข้าสู่ระบบ...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("[PrivateRoute] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Suspense fallback={<LoadingSpinner />}><Dashboard /></Suspense>} />
          <Route path="/repairs" element={<Suspense fallback={<LoadingSpinner />}><Repairs /></Suspense>} />
          <Route path="/repair/new" element={<Suspense fallback={<LoadingSpinner />}><CreateRepair /></Suspense>} />
          <Route path="/repair/:id" element={<Suspense fallback={<LoadingSpinner />}><RepairDetail /></Suspense>} />
          <Route path="/notifications" element={<Suspense fallback={<LoadingSpinner />}><Notifications /></Suspense>} />
          <Route path="/users" element={<Suspense fallback={<LoadingSpinner />}><Users /></Suspense>} />
          <Route path="/statistics" element={<Suspense fallback={<LoadingSpinner />}><Statistics /></Suspense>} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>} />
    </Routes>
  );
};

export default AppRoutes;
