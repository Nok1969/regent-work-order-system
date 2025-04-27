import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/contexts/AuthContext";
import NotificationProvider from "@/contexts/NotificationContext";
import RepairProvider from "@/contexts/RepairContext";
import AppRoutes from "./AppRoutes";

// Create future flags configuration for React Router
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

const App = () => {
  // Always create the QueryClient inside the component to ensure
  // it has access to the React context and hooks
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={routerFutureConfig}>
        <AuthProvider>
          <NotificationProvider>
            <RepairProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <AppRoutes />
              </TooltipProvider>
            </RepairProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
