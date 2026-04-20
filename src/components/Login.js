import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../output.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('https://projectposserver-production.up.railway.app/api/userslogin', { username, password });
            if (response.data && response.data.resultuser) {

                localStorage.setItem('user_id', response.data.resultuser.user_id);   // ✅ เพิ่มบรรทัดนี้
                localStorage.setItem('userRole', response.data.resultuser.user_status);
                localStorage.setItem('userFirstName', response.data.resultuser.user_firstname);
                console.log(response.data.resultuser);
                navigate('/Home');
            } else {
                alert('เข้าสู่ระบบไม่สำเร็จ');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else {
                alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-sm">
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                        alt="login"
                        className="w-16 mb-3 opacity-85"
                    />
                    <h2 className="text-2xl font-bold text-blue-700 mb-2 tracking-wide">xx เข้าสู่ระบบ xx</h2>
                    <p className="text-gray-500 mb-4 text-base">กรุณากรอกชื่อผู้ใช้และรหัสผ่าน</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block font-semibold text-blue-700 mb-1">ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                            placeholder="Username"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block font-semibold text-blue-700 mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                            placeholder="Password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-lg font-bold text-lg shadow hover:from-blue-800 hover:to-blue-500 transition"
                        disabled={loading}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                    <button
                        type="button"
                        className="w-full py-3 bg-gray-200 text-blue-700 rounded-lg font-bold text-lg mt-1 hover:bg-gray-300 transition"
                        onClick={() => { setUsername(''); setPassword(''); }}
                    >
                        ล้างข้อมูล
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;