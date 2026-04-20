import React, { useState, useEffect } from "react";
import { Menu, Bell, Search } from "lucide-react";
import logo from './img/LOGO-KMUTNB.png';
import Navbar2 from "./Navbar2"; // Import Navbar
import axios from "axios";

/**
 * Topbar — blue background with a left icon
 *
 * Usage:
 *   <Topbar title="POS Shop" onMenuClick={() => console.log('menu')} />
 */
export default function Topbar({
  title = "My App",
  onMenuClick = () => { },
  rightContent,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  // const Fname = localStorage.getItem('user_fn') || 'User';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://projectposserver-production.up.railway.app/api/showusers');
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-blue-600 text-white shadow-lg">
      <div className="mx-auto flex h-[80px] max-w-screen-xl items-center gap-4 px-6">


        <img src={logo} alt="Logo" style={{ height: '40px', width: '40px' }} />

        {/* Title / brand */}
        <div className="flex min-w-0 flex-1 items-center">
          <span className="truncate text-xl font-semibold tracking-wide">
            {title}
          </span>
        </div>


        <div className="hidden items-center gap-2 sm:flex ">
          <p>Welcome, {users[0]?.user_fn || "User"}</p>
        </div>

        {/* Right area (notifications or custom content) */}
        <div className="flex items-center gap-2">
          {rightContent}
          <button
            aria-label="Notifications"
            className="rounded-2xl p-3 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Conditionally render Navbar */}
      {/* {isMenuOpen && <Navbar />} */}
      <Navbar2/>
    </header>
  );
}