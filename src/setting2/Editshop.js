import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';


function Editshop({ shopID,onClose }) {
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopTel, setShopTel] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!shopID) {
            setLoading(false);
            return;
        }
        const fetchShop = async () => {
            try {
                const response = await axios.get(`https://projectposserver-production.up.railway.app/api/getshop/${shopID}`);
                const shopData = response.data.data;
                setShopName(shopData.shop_name);
                setShopAddress(shopData.shop_address);
                setShopTel(shopData.shop_tel);
            } catch (error) {
                console.error('Error fetching shop:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [shopID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            shop_name: shopName,
            shop_address: shopAddress,
            shop_tel: shopTel
        };
        try {
            await axios.put(`https://projectposserver-production.up.railway.app/api/updateshop/${shopID}`, updatedData);
            Swal.fire({
                icon: 'success',
                title: 'แก้ไขข้อมูลร้านค้าสำเร็จ',
                showConfirmButton: false,
            });
            onClose();
        } catch (error) {
            console.error('Error updating shop:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถแก้ไขข้อมูลร้านค้าได้',
            });
        }
    };

    return (
        <div>
            <h2>แก้ไขข้อมูลร้านค้า</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-semibold">ชื่อร้านค้า:</label>
                    <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">ที่อยู่ร้านค้า:</label>
                    <input
                        type="text"
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">เบอร์โทรร้านค้า:</label>
                    <input
                        type="text"
                        value={shopTel}
                        onChange={(e) => setShopTel(e.target.value)}
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    บันทึกการแก้ไข
                </button>
            </form>

        </div>
    );
}

export default Editshop;