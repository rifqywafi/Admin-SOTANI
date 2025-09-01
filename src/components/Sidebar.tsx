// components/Sidebar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Database,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [showText, setShowText] = useState(true);
  const location = useLocation();

  // Delay tulisan biar tidak "stretching"
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isOpen) {
      timer = setTimeout(() => setShowText(true), 200);
    } else {
      setShowText(false);
    }

    return () => clearTimeout(timer);
  }, [isOpen]);

  const menus = [
    { name: "Dashboard", icon: <Home size={20} />, paths: ["/", "/dashboard"] },
    { name: "Data Sawit", icon: <Database size={20} />, paths: ["/sawit"] },
    { name: "Analytics", icon: <BarChart3 size={20} />, paths: ["/analytics"] },
    { name: "Users", icon: <Users size={20} />, paths: ["/users"] },
    { name: "Settings", icon: <Settings size={20} />, paths: ["/settings"] },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } h-full bg-primary text-white p-4 flex flex-col transition-all duration-300 shadow-xl relative`}
    >
      {/* Brand & Toggle */}
      <div className="flex items-center justify-between">
        {showText && (
          <h1 className="text-2xl font-bold tracking-wide overflow-hidden">
            Sotani
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-8 flex flex-col gap-2">
        {menus.map((menu, i) => {
          const isActive = menu.paths.some((p) => location.pathname === p);

          return (
            <Link
              key={i}
              to={menu.paths[0]} // ambil path utama untuk link
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all relative cursor-pointer
                hover:bg-white hover:text-primary 
                ${isActive ? "bg-white text-primary" : ""}`}
            >
              {menu.icon}
              {showText && (
                <span className="text-sm font-medium">{menu.name}</span>
              )}

              {/* Tooltip saat sidebar collapse */}
              {!isOpen && (
                <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {menu.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
