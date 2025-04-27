// Responsive Navbar Component
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: "/dashboard", label: "แดชบอร์ด", roles: ["staff", "technician", "manager", "admin"] },
    { path: "/repairs", label: "รายการซ่อม", roles: ["staff", "technician", "manager", "admin"] },
    { path: "/statistics", label: "สถิติ", roles: ["manager", "admin"] },
    { path: "/users", label: "ผู้ใช้งาน", roles: ["admin"] },
  ];

  return (
    <nav className="bg-white border-b shadow-md px-4 py-2 flex justify-between items-center">
      <div className="text-lg font-bold">Regent Work Order</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        {menuItems.map((item) => (
          hasPermission(item.roles) && (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                location.pathname === item.path ? "text-blue-600 font-semibold" : "text-gray-700"
              } hover:text-blue-500`}
            >
              {item.label}
            </Link>
          )
        ))}
        <Button variant="ghost" onClick={logout}>ออกจากระบบ</Button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <Button variant="ghost" onClick={toggleMenu}>
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
                } hover:bg-gray-100`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          <Button variant="ghost" className="w-full text-left px-4 py-2" onClick={logout}>ออกจากระบบ</Button>
        </div>
      )}
    </nav>
  );
}