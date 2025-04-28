// Responsive Navbar Component
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart, Wrench, Users, BarChart3 } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/types";

export default function Navbar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: "/dashboard", label: "แดชบอร์ด", icon: <BarChart3 size={18} />, roles: ['staff', 'technician', 'manager', 'admin'] as UserRole[] },
    { path: "/repairs", label: "รายการซ่อม", icon: <Wrench size={18} />, roles: ['staff', 'technician', 'manager', 'admin'] as UserRole[] },
    { path: "/statistics", label: "สถิติ", icon: <BarChart size={18} />, roles: ['manager', 'admin'] as UserRole[] },
    { path: "/users", label: "ผู้ใช้งาน", icon: <Users size={18} />, roles: ['admin'] as UserRole[] },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md px-4 py-2 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
        {/* ไอคอนตัว R */}
        <div className="flex items-center justify-center bg-yellow-300 text-blue-700 font-bold rounded-full h-8 w-8 shadow-md">
          R
        </div>
        <div className="text-lg font-bold">Regent Work Order</div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        {menuItems.map((item) => (
          hasPermission(item.roles) && (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                location.pathname === item.path ? "text-yellow-300 font-semibold" : "text-white"
              } hover:text-yellow-200 flex items-center gap-1`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        ))}
        <Button variant="ghost" className="text-white hover:text-yellow-200 hover:bg-blue-500/20" onClick={logout}>ออกจากระบบ</Button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <Button variant="ghost" className="text-white hover:bg-blue-500/20" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-50">
          {menuItems.map((item) => (
            hasPermission(item.roles) && (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 ${
                  location.pathname === item.path ? "text-blue-600 font-semibold" : "text-gray-700"
                } hover:bg-gray-100 flex items-center gap-2`}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-blue-600">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          ))}
          <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
            <span className="text-red-500"><X size={18} /></span>
            <Button variant="ghost" className="w-full text-left p-0" onClick={logout}>ออกจากระบบ</Button>
          </div>
        </div>
      )}
    </nav>
  );
}