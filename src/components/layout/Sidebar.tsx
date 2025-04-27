import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { 
  Bell, 
  UserCog, 
  LogOut, 
  Menu,
  X,
  Home,
  BarChart3,
  Wrench,
  Users,
  BarChart,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  allowedRoles: UserRole[];
}

const SidebarLink = ({ to, icon, label, badge, allowedRoles }: SidebarLinkProps) => {
  const { hasPermission } = useAuth();
  const { pathname } = useLocation();
  const isActive = pathname === to;

  if (!hasPermission(allowedRoles)) return null;

  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:text-primary",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {badge}
        </span>
      )}
    </Link>
  );
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:relative md:z-0",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-sidebar-foreground font-bold text-xl">
                ระบบแจ้งซ่อม
              </span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <Home className="h-6 w-6 text-sidebar-foreground" />
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-sidebar-foreground"
            onClick={() => setCollapsed(true)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-2">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/20 p-2">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user.name}</span>
                <span className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            <SidebarLink 
              to="/dashboard" 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="แดชบอร์ด" 
              allowedRoles={["staff", "technician", "admin", "manager"]}
            />
            <SidebarLink 
              to="/repairs" 
              icon={<Wrench className="h-5 w-5" />} 
              label="รายการแจ้งซ่อม" 
              allowedRoles={["staff", "technician", "admin", "manager"]}
            />
            <SidebarLink 
              to="/notifications" 
              icon={<Bell className="h-5 w-5" />}
              label="การแจ้งเตือน" 
              badge={unreadCount}
              allowedRoles={["staff", "technician", "admin", "manager"]}
            />
            <SidebarLink 
              to="/statistics" 
              icon={<BarChart className="h-5 w-5" />} 
              label="สถิติการแจ้งซ่อม" 
              allowedRoles={["manager", "admin"]}
            />
            <SidebarLink 
              to="/reports" 
              icon={<FileText className="h-5 w-5" />} 
              label="รายงาน" 
              allowedRoles={["manager", "admin"]}
            />
            <SidebarLink 
              to="/users" 
              icon={<Users className="h-5 w-5" />} 
              label="จัดการผู้ใช้" 
              allowedRoles={["admin"]}
            />
          </nav>
        </div>

        <div className="border-t border-sidebar-border p-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50",
              collapsed && "justify-center"
            )} 
            onClick={logout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {!collapsed && <span>ออกจากระบบ</span>}
          </Button>
        </div>
      </aside>

      {/* Toggle button for mobile */}
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "fixed bottom-4 right-4 z-50 md:hidden",
          !collapsed && "hidden"
        )}
        onClick={() => setCollapsed(false)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Toggle button for desktop */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed bottom-4 right-4 z-50 hidden md:flex"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}
