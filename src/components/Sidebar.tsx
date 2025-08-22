// components/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Database, BarChart3, Settings, Users } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menus = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Data Sawit", icon: <Database size={20} />, path: "/data" },
    { name: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } h-screen bg-primary text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl font-bold tracking-wide transition-all ${
            !isOpen && "opacity-0 w-0"
          }`}
        >
          Sotani
        </h1>
        <button
          className="btn btn-sm btn-ghost text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "<" : ">"}
        </button>
      </div>

      {/* Menu */}
      <nav className="mt-8 flex flex-col gap-3">
        {menus.map((menu, i) => (
          <Link
            key={i}
            to={menu.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all
            hover:bg-white hover:text-primary 
            ${location.pathname === menu.path ? "bg-white text-primary" : ""}`}
          >
            {menu.icon}
            <span className={`${!isOpen && "hidden"} text-sm font-medium`}>
              {menu.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}