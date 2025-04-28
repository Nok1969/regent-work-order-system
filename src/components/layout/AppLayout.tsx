import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";

export function AppLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isMobile = useMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Update sidebar collapsed state when mobile detection changes
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <Navbar />
        <main className="flex-1 w-full p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet /> {/* Content Area */}
        </main>
        <Toaster />
      </div>
    </div>
  );
}
