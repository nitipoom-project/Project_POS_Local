import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import '../output.css';
import { TiShoppingCart } from "react-icons/ti";
import { IoTrashSharp, IoPencil } from "react-icons/io5";
import Payment from '../Products/Payment';
import Swal from 'sweetalert2';

function Product() {
    const [products, setProducts] = useState([]);
    const [productsTemp, setProductsTemp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [barcode, setBarcode] = useState('');
    const [category, setCategory] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [barcodeBuffer, setBarcodeBuffer] = useState('');
    // const [view, setView] = useState("cart");
    // const [promptpay, setPromptpay] = useState(true);
    // const [cash, setCash] = useState(true);


    useEffect(() => {
        let timer = null;

        const handleKeyDown = (e) => {
            // ❌ ไม่ดักตอนพิมพ์ใน input / textarea
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            // เมื่อ scanner ส่ง Enter
            if (e.key === 'Enter' && barcodeBuffer.length > 0) {
                if (barcodeBuffer.length > 0) {
                    const product = products.find(
                        p => String(p.product_barcode) === barcodeBuffer
                    );

                    if (product) {
                        handleSelect(product);
                    } else {
                        Swal.fire({
                            title: 'ไม่พบสินค้า',
                            text: `Barcode: ${barcodeBuffer}`,
                            icon: 'error',
                            timer: 1200,
                            showConfirmButton: false
                        });
                    }

                    setBarcodeBuffer('');
                }
                return;
            }

            // เก็บเฉพาะตัวอักษร
            if (/^[0-9a-zA-Z]$/.test(e.key)) {
                setBarcodeBuffer(prev => prev + e.key);

                // reset ถ้าพิมพ์ห่างเกิน (ป้องกันพิมพ์มือ)
                clearTimeout(timer);
                timer = setTimeout(() => {
                    setBarcodeBuffer('');
                }, 100);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [barcodeBuffer, products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://projectposserver-production.up.railway.app/api/showproducts');
                setProducts(response.data.data || []);
                setProductsTemp(response.data.data || []);
            } catch (error) {
                setProducts([]);
                // setProductsTemp([]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('https://projectposserver-production.up.railway.app/api/category');
                setCategory(response.data.data || []);
                // console.log('data:', response.data.data);
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        fetchCategory();
    }, []);

    // เพิ่มสินค้าเข้า selected
    const handleSelect = (product) => {

        // 1️⃣ เช็ค stock ก่อนทำอะไรทั้งหมด
        if (product.product_quantity <= 0) {
            Swal.fire({
                title: "สินค้าหมด",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500,
            });
            return; // ❗ หยุดการทำงานทันที
        }

        // 2️⃣ เช็คว่ามีสินค้าในตะกร้าแล้วไหม
        const existingProduct = selected.find(
            p => p.product_id === product.product_id
        );

        // 3️⃣ กรณีมีสินค้าอยู่แล้ว
        if (existingProduct) {

            // 3.1 เช็คว่าเกิน stock หรือยัง
            if (existingProduct.quantity >= product.product_quantity) {
                Swal.fire({
                    title: "สินค้าหมด",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1500,
                });
                return;
            }

            // 3.2 เพิ่มจำนวน
            setSelected(prev =>
                prev.map(p =>
                    p.product_id === product.product_id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            );

            setTotal(prev => prev + product.product_price);

        } else {

            // 4️⃣ กรณียังไม่มีในตะกร้า
            setSelected(prev => [
                ...prev,
                { ...product, quantity: 1 }
            ]);

            setTotal(prev => prev + product.product_price);
        }
    };

    // ลบสินค้าออกจาก selected
    const handleRemove = (product_id) => {
        const product = selected.find(p => p.product_id === product_id);
        if (product) {
            setTotal(prevTotal => prevTotal - (product.product_price * product.quantity));
        }
        setSelected(selected.filter(p => p.product_id !== product_id));
    };

    const handleDelete = () => {
        setSelected([]);
        setTotal(0);
        setTotalPrice(0);
    };

    const handleClosePopup = () => {
        setIsOpen(false);
        setSelected([]);
        setTotal(0);
        setTotalPrice(0);
        // setProduct([]);
        // setTotal(0);
        // setSelectedUser(null);
    };
    const barcodeRef = useRef(null);

    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    const handlePaymentSuccess = () => {
    // เคลียร์ตะกร้าและยอดเงิน
    setSelected([]);
    setTotal(0);
    setTotalPrice(0);
    // ปิด Modal
    setIsOpen(false); 
    
    // (เพิ่มเติม) คุณอาจจะ fetchProducts ใหม่เพื่ออัปเดตสต็อกหน้าเว็บ
    // fetchProducts(); 
};


    return (

        <div className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto p-4 gap-6 mt-8">
            {/* ส่วนตะกร้าสินค้าหลัก */}
            <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 p-6">
                    <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                        <TiShoppingCart className="text-3xl" />
                        ตะกร้าสินค้า
                    </h1>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead>
                                <tr className="text-gray-500 text-sm uppercase tracking-wider">
                                    <th className="px-4 py-2">สินค้า</th>
                                    <th className="px-4 py-2 text-center">จำนวน</th>
                                    <th className="px-4 py-2 text-right">ราคา</th>
                                    <th className="px-4 py-2 text-right">รวม</th>
                                    <th className="px-4 py-2 text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <div className="flex flex-col items-center text-gray-400">
                                                <TiShoppingCart size={48} className="mb-2 opacity-20" />
                                                <p>ไม่มีสินค้าในตะกร้าของคุณ</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    selected.map((item) => (
                                        <tr key={item.product_id} className="bg-gray-50 hover:bg-blue-50 transition-colors rounded-lg group">
                                            <td className="px-4 py-4 font-medium text-gray-700 rounded-l-xl">
                                                {item.product_name}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="bg-white px-3 py-1 rounded-full border border-gray-200 text-sm font-semibold">
                                                    x{item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-gray-600">
                                                {Number(item.product_price).toLocaleString()} ฿
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold text-blue-600">
                                                {(item.product_price * item.quantity).toLocaleString()} ฿
                                            </td>
                                            <td className="px-4 py-4 text-center rounded-r-xl">
                                                <button
                                                    onClick={() => handleRemove(item.product_id)}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                >
                                                    <IoTrashSharp size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ส่วนสรุปยอดเงิน (Side Panel) */}
            <div className="w-full lg:w-80 space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">สรุปรายการ</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>จำนวนทั้งหมด</span>
                            <span>{selected.reduce((acc, curr) => acc + curr.quantity, 0)} ชิ้น</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-dashed">
                            <span className="text-gray-800 font-bold">ยอดชำระสุทธิ</span>
                            <span className="text-2xl font-black text-blue-600">
                                {Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-3">
                        <button
                            onClick={() => selected.length > 0 && setIsOpen(true)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 flex justify-center items-center gap-2"
                        >
                            ชำระเงิน
                        </button>
                        <button
                            onClick={() => handleDelete()}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl border border-red-100 transition-all active:scale-95"
                        >
                            ยกเลิกรายการ
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal ชำระเงิน */}
            {isOpen && total > 0 && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 border-black-500 flex justify-center items-center rounded-lg"
                    style={{ backdropFilter: 'blur(5px)', borderColor: 'black' }}> {/* Changed background opacity */}
                    <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                        <Payment total={total} selected={[selected]} user_id={selected.user_id} onClose={handleClosePopup} onSuccess={handlePaymentSuccess}/>
                        {/* <p className='mt-8'>****** ราคารวม : {total} ******</p> */}
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-4 right-6 bg-gray-200 text-gray-600 rounded-full w-8 h-8 text-xl flex items-center justify-center hover:bg-gray-300 transition"
                        >
                            x
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Product;