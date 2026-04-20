import React,{useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBoxOpen, FaChartBar, FaCog, FaCube } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการ
import { MdOutlineExitToApp } from "react-icons/md";

import '../output.css';

function Navbar() {
  const role = localStorage.getItem('userRole'); // 'admin' หรือ 'user'
  const location = useLocation();

  // ฟังก์ชันสำหรับตรวจสอบว่าเมนูนั้นคือเมนูที่ใช้งานอยู่หรือไม่
  const isActive = (path) => location.pathname.includes(path);

  return (
    <nav className="fixed top-0 left-0 h-screen w-56 bg-blue-700 text-white flex flex-col items-start py-8 px-0 shadow-lg z-20">
      {/* ส่วนหัวของ Navbar เช่น ชื่อแอปพลิเคชัน */}
      <div className="text-xl font-bold px-8 mb-6">
        ร้านค้า
      </div>

      {/* ส่วนเมนูหลัก */}
      <div className="w-full flex flex-col gap-2">
        {role === 'admin' && (
          <>
            <Link
              to="/home/Product"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Product') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaCube /> {/* ไอคอนสำหรับเมนู Product */}
              Product
            </Link>
            <Link
              to="/home/Stock"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Stock') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaBoxOpen /> {/* ไอคอนสำหรับเมนู STOCK */}
              STOCK
            </Link>
            <Link
              to="/home/Report"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Report') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaChartBar /> {/* ไอคอนสำหรับเมนู REPORT */}
              REPORT
            </Link>
{/*----------------------------------------------------------------------*/}
            <Link
              to="/home/Setting"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Setting') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaCog /> 
              SETTING
            </Link>
          </>
/*----------------------------------------------------------------------*/
        )}
        {role === 'user' && (
          <>
            <Link
              to="/home/Product"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Product') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaCube /> {/* ไอคอนสำหรับเมนู Product */}
              Product
            </Link>
            <Link
              to="/home/Stock"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Stock') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaBoxOpen /> {/* ไอคอนสำหรับเมนู STOCK */}
              STOCK
            </Link>
          </>
        )}
      </div>

      {/* ใช้ flex-1 เพื่อให้ปุ่ม Logout อยู่ด้านล่างสุด */}
      <div className="flex-1" />

      {/* ปุ่ม Logout */}
      <Link
        to="/"
        className="flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl hover:bg-red-600 font-semibold transition mb-2"
      >
        <div className="flex items-center gap-2">
          <MdOutlineExitToApp />
          Logout
        </div>
      </Link>

      {/* ส่วนแสดงสถานะผู้ใช้ */}
      <div className="px-8 py-4 text-sm opacity-80">
        สถานะ: <span className="font-bold">{role ? role.toUpperCase() : 'GUEST'}</span>
      </div>
    </nav>
  );
};

export default Navbar;