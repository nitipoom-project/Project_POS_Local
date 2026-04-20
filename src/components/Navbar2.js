import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBoxOpen, FaChartBar, FaCog, FaCube } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการ
import { MdOutlineExitToApp } from "react-icons/md";

import '../output.css';

function Navbar2() {
    const role = localStorage.getItem('userRole'); // 'admin' หรือ 'user'
    const location = useLocation();

    //   ฟังก์ชันสำหรับตรวจสอบว่าเมนูนั้นคือเมนูที่ใช้งานอยู่หรือไม่
    const isActive = (path) => location.pathname.includes(path);
    const [open, setOpen] = useState(false);
    return (
        <nav className="fixed top-0 left-0 h-screen w-56 bg-blue-700 text-white flex flex-col items-start py-8 px-0 shadow-lg z-20">
            {/* ส่วนหัวของ Navbar เช่น ชื่อแอปพลิเคชัน */}
            <div className="text-xl font-bold px-8 mb-6">
                STORE
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
                        <div className="w-full">

                            {/* แถวเมนูหลัก */}
                            <div
                                className="flex items-center justify-between w-full py-3 px-8 rounded-r-2xl font-semibold cursor-pointer hover:bg-gray-100 transition"
                                onClick={() => setOpen(!open)}
                            >
                                <div className=''>
                                    {/* <span><FaCog /> SETTING</span> */}

                                    {/* ลูกศร */}
                                    <span className={`transition-transform text-sm flex items-center gap-4 ${open ? "rotate-180" : ""}`}>
                                        <FaCog />SETTING &nbsp;&#9660;
                                    </span>
                                </div>
                            </div>

                            {/* เมนูย่อย */}
                            {open && (
                                <div className="ml-12 mt-2 flex flex-col gap-2 pb-2">

                                    {/* <button className="flex items-center gap-2 p-2 hover:text-teal-500 transition"> */}
                                        <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                        <Link to="/home/Setting" className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Setting') ? 'bg-blue-900' : 'hover:bg-blue-800'
                                            }`}>
                                                รายชื่อผู้ใช้งาน
                                        </Link>
                                    {/* </button> */}

                                    {/* <button className="flex items-center gap-2 p-2 hover:text-teal-500 transition"> */}
                                        <span className="w-2 h-2 bg-teal-500 rounded-full" ></span>
                                        <Link to="/home/Setting2" className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Setting2') ? 'bg-blue-900' : 'hover:bg-blue-800'
                                            }`}>
                                                ข้อมูลร้านค้า
                                        </Link>
                                    {/* </button> */}

                                    {/* <button className="flex items-center gap-2 p-2 hover:text-teal-500 transition"> */}
                                        <span className="w-2 h-2 bg-teal-500 rounded-full" ></span>
                                        <Link to="/home/Setting3" className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Setting3') ? 'bg-blue-900' : 'hover:bg-blue-800'
                                            }`}>
                                                ข้อมูลการชำระเงิน
                                        </Link>
                                    {/* </button> */}

                                </div>
                            )}
                        </div>
                        {/* <Link
              to="/home/Setting"
              className={`flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition ${isActive('/home/Setting') ? 'bg-blue-900' : 'hover:bg-blue-800'
                }`}
            >
              <FaCog />  */}
                        {/* ไอคอนสำหรับเมนู SETTING */}
                        {/* SETTING */}
                        {/* <select className="flex items-center gap-4 w-full py-3 px-8 rounded-r-2xl font-semibold transition">
                <option value="en">EN</option>
                <option value="th">TH</option>
              </select> */}
                        {/* </Link> */}
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
        // ----------------------------------------------------------------------------------------------------------------------------------
        // <div className="w-64 p-4 text-gray-700">

        //     {/* เมนูหลัก */}
        //     <div 
        //         className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 rounded-md"
        //         onClick={() => setOpen(!open)}
        //     >
        //         <span className="font-medium">ข้อมูลส่วนตัว</span>

        //         {/* ลูกศร */}
        //         <span className={`transition-transform ${open ? "rotate-180" : ""}`}>
        //             ▼
        //         </span>
        //     </div>}
        //     {/* เมนูย่อย */}
        //     {open && (
        //         <div className="ml-8 mt-2 flex flex-col gap-2">

        //             <button className="flex items-center gap-2 p-2 hover:text-teal-500">
        //                 <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
        //                 ประวัตินักศึกษา
        //             </button>

        //             <button className="flex items-center gap-2 p-2 hover:text-teal-500">
        //                 <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
        //                 ประวัติการเข้าใช้ระบบ
        //             </button>

        //         </div>
        //     )}
        // </div>
        // -------------------------------------------------------------------------------------------------------------------------------------
    );
};

export default Navbar2;