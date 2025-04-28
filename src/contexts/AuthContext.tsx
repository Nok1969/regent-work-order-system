import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permissions: UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Making the provider component the default export for Fast Refresh compatibility
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/', '/signup'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    console.log("[AuthProvider] Initial setup - location:", location.pathname);
    
    // Flag to prevent memory leaks
    let isMounted = true;
    
    // Handle session changes
    const handleSessionChange = async (session) => {
      if (!isMounted) return;
      
      try {
        if (session) {
          // Session exists, fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error("[AuthProvider] Error fetching profile:", profileError);
            // Handle case where profile doesn't exist yet but user is authenticated
            // This could happen if the user was created but profile wasn't
            if (isMounted) {
              setUser(null);
              setIsAuthenticated(false);
              setIsLoading(false);
            }
            return;
          }
          
          if (profile && isMounted) {
            const authUser: User = {
              id: session.user.id,
              username: session.user.email || '',
              name: profile.name || '',
              role: profile.role as UserRole || 'staff',
              avatar: profile.avatar
            };
            
            console.log("[AuthProvider] User authenticated:", authUser);
            setUser(authUser);
            setIsAuthenticated(true);
          }
        } else {
          console.log("[AuthProvider] No session found");
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Error in session handling:", error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthProvider] Auth state changed:", event, session?.user?.email);
        await handleSessionChange(session);
      }
    );
    
    // Initial session check
    const checkInitialSession = async () => {
      try {
        console.log("[AuthProvider] Checking initial session...");
        const { data: { session } } = await supabase.auth.getSession();
        await handleSessionChange(session);
      } catch (error) {
        console.error("[AuthProvider] Initial session check error:", error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } finally {
        if (isMounted) {
          console.log("[AuthProvider] Finished session check - setIsLoading false");
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();
    
    return () => {
      console.log("[AuthProvider] Cleaning up auth subscription");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("[AuthProvider] Attempting login for:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("[AuthProvider] Login error:", error.message);
        setIsLoading(false);
        throw new Error(error.message);
      }

      if (data.session) {
        console.log("[AuthProvider] Login successful");
        // Auth state change will handle the update
        
        // Check for redirect after login
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath, { replace: true });
        }
        
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("[AuthProvider] Login catch error:", err);
      setIsLoading(false);
      throw err; // Re-throw to let the login component handle the error
    }
  };

  const logout = async () => {
    try {
      console.log("[AuthProvider] Attempting logout");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthProvider] Logout error:", error);
      }
      
      // Force state reset
      setUser(null);
      setIsAuthenticated(false);
      
      // Navigate immediately
      console.log("[AuthProvider] Redirecting to login after logout");
      navigate('/login', { replace: true });
      
      setIsLoading(false);
    } catch (error) {
      console.error("[AuthProvider] Logout catch error:", error);
      setIsLoading(false);
    }
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  // Show loading UI only for protected routes
  if (isLoading && !isPublicRoute) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasPermission, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
