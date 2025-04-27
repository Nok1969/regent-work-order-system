import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export function AppLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  console.log("[AppLayout] Auth state check - isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading);

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
    console.log("[AppLayout] Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Make sure user is loaded before rendering the layout
  if (!user) {
    console.log("[AppLayout] User is null, showing loading");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log("[AppLayout] Rendering layout for user:", user.username);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-20">
          <main className="min-h-screen">
            <Outlet />
          </main>
          <Toaster />
        </div>
      </div>
    </div>
  );
}
