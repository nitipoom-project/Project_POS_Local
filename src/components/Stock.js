import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InputProduct from './Inputproduct';
import Editproducts from './Editproduct';
import '../output.css';
import Barcode from 'react-barcode';
import Swal from 'sweetalert2';
import { IoTrashSharp, IoPencil } from "react-icons/io5";
import { FaCartPlus } from "react-icons/fa";
import { MdSettings } from 'react-icons/md'

function Stock() {
    const [selected, setSelected] = useState(null);
    const [products, setProducts] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState([]);
    const [productsTemp, setProductsTemp] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenedit, setIsOpenedit] = useState(false);

    const handleClosePopup = async () => {
        setIsOpen(false);
        setIsOpenedit(false);
        setSelected(null);
        console.log('Popup closed, selected reset to:', selected);
        await fetchProducts();
    }

    // ✅ ดึงสินค้าทั้งหมด
    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/showproducts');
            setProducts(response.data.data || []);
            setProductsTemp(response.data.data || []);
            // await fetchProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    // ✅ ดึงหมวดหมู่
    const fetchCategory = useCallback(async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/category');
            setCategory(response.data.data || []);
        } catch (error) {
            console.error('Error fetching category:', error);
        }
    }, []);

    // ✅ เรียกครั้งแรก
    useEffect(() => {
        fetchProducts();
        fetchCategory();
    }, [fetchProducts, fetchCategory]);

    const handleEditClick = (productId) => {
        setSelected(productId);
        console.log('Selected Product:', selected);
        setIsOpen(true);
        setIsOpenedit(true);
    };

    return (
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg mt-8">
            <div className="flex justify-between items-center mb-8 px-8 pt-8">
                <h1 className="text-4xl font-bold text-blue-700">MY STOCK</h1>
            </div>
            {/*---------------------------------------------------------------------------------------------------------------------------------------------------- */}

            {/* ฟิลเตอร์ค้นหา */}
            <div className="px-8 pb-8">
                <div className="flex items-center gap-2">
                    <input
                        className="flex px-3 py-2 rounded-lg w-56 border border-gray-300"
                        type="text"
                        placeholder="   ยิง Barcode ที่นี่"
                        value={barcode}
                        maxLength={"13"}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const filteredProducts = products.filter(product =>
                                    String(product.product_barcode).includes(barcode)
                                );
                                setProductsTemp(filteredProducts);
                                setBarcode('');
                            }
                        }}
                    />
                    <input
                        type="text"
                        className="flex px-3 py-2 rounded-lg w-56 border border-gray-300"
                        placeholder="   ค้นหาสินค้า"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const filteredProducts = products.filter(product =>
                                    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                                );
                                setProductsTemp(filteredProducts);
                                setSearchTerm('');
                            }
                        }}
                    />

                    <div>
                        <select
                            className="border px-3 py-2 rounded-lg max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onChange={(e) => {
                                const selectedCategory = e.target.value;
                                if (selectedCategory) {
                                    const filteredProducts = products.filter(product =>
                                        product.category_id === Number(selectedCategory)
                                    );
                                    setProductsTemp(filteredProducts);
                                } else {
                                    setProductsTemp(products);
                                }
                            }}
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {category.map((c) => (
                                <option key={c.category_id} value={c.category_id}>
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            className="border px-3 py-2 rounded-lg max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onChange={(e) => {
                                const selectedStatus = e.target.value;
                                if (selectedStatus) {
                                    const filteredProducts = products.filter(product => {
                                        if (selectedStatus === '1') {
                                            return product.product_quantity > 10; // สินค้าปกติ
                                        } else if (selectedStatus === '2') {
                                            return product.product_quantity > 0 && product.product_quantity <= 10; // ใกล้หมด
                                        } else if (selectedStatus === '3') {
                                            return product.product_quantity === 0; // หมด
                                        }
                                        return false;
                                    });
                                    setProductsTemp(filteredProducts);
                                } else {
                                    setProductsTemp(products);
                                }
                            }}
                        >
                            <option value="" >สถานะสินค้า</option>
                            <option value="1" className='bg-green-400'>สินค้าปกติ</option>
                            <option value="2" className='bg-yellow-400'>ใกล้หมด</option>
                            <option value="3" className='bg-red-400'>หมด</option>
                        </select>
                    </div>
                    <button
                        className="flex py-2 px-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 gap-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className='flex gap-2 items-center'>
                            <FaCartPlus />
                            เพิ่มสินค้า
                        </div>
                    </button>
                </div>
            </div>

            {/*---------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* ตารางสินค้า */}
            <div className="overflow-x-auto px-8 pb-8">
                <table className="w-full border-collapse shadow mt-1">
                    <thead>
                        <tr className="bg-blue-100 border-b-2 border-blue-200">
                            {/* <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">barcode</th> */}
                            {/* <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">รูปสินค้า</th> */}
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">ชื่อสินค้า</th>
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">จำนวนสินค้า</th>
                            {/* <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">หน่วยนับ</th> */}
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">ทุน</th>
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">ขาย</th>
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">รายละเอียด</th>
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">ประเภท</th>
                            <th className="py-3 px-4 text-blue-700 font-semibold border-b-2 border-blue-200">
                                <div className='flex justify-center items-center font-bold'>
                                    <MdSettings />
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {productsTemp.map((product) => (
                            <tr key={product.product_id} className="hover:bg-blue-50">
                                {/* <td className="overflow-x-auto border-b">
                                    <div className="flex justify-center">
                                        <Barcode
                                            value={product.product_barcode}
                                            height={40}
                                            fontSize={7}
                                            background="transparent"
                                        />
                                    </div>
                                </td> */}
                                {/* <td className="py-2 px-4 text-center border-b">{product.product_name}</td> */}
                                {/* <td>
                                    <img
                                        src={`http://localhost:3001/uploads/${product.image}`}
                                        className="w-24 h-40 object-cover rounded  border-b"
                                    />
                                </td> */}
                                <td className="py-2 px-4 text-center border-b">{product.product_name}</td>
                                <td className="py-2 px-4 text-center border-b">{product.product_quantity} {product.unit_name}</td>
                                <td className="py-2 px-4 text-right border-b">{product.product_cost} ฿</td>
                                <td className="py-2 px-4 text-right border-b">{product.product_price} ฿</td>
                                <td className="py-2 px-4 text-center border-b">{product.product_detail}</td>
                                <td className="py-2 px-4 text-center border-b">{product.category_name}</td>
                                <td className="py-2 px-4 text-center border-b">
                                    <button
                                        className='bg-gray-200 text-gray-800 rounded-lg px-4 py-2'
                                        onClick={() => handleEditClick(product.product_id)}
                                        disabled={isOpen} // Disable the button when the popup is open
                                    >
                                        <IoPencil className='text-xl' /> {/* Edit */}

                                    </button>
                                    &nbsp;&nbsp;&nbsp;
                                    <button
                                        className='bg-red-500 text-white rounded-lg px-4 py-2'
                                        onClick={async () => {
                                            Swal.fire({
                                                title: "Are you sure?",
                                                text: "You won't be able to revert this!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Yes, delete it!"
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    try {
                                                         axios.delete(`https://projectposserver-production.up.railway.app/api/deleteproduct/${product.product_id}`);
                                                        //  fetchProducts(); // ✅ อัปเดตข้อมูลใหม่
                                                        Swal.fire({
                                                            title: "Deleted!",
                                                            text: "Your file has been deleted.",
                                                            icon: "success"
                                                        });
                                                    } catch (error) {
                                                        console.error('Error deleting product:', error);
                                                        Swal.fire({
                                                            title: "Error!",
                                                            text: "ไม่สามารถลบสินค้าได้",
                                                            icon: "error"
                                                        });
                                                    }
                                                    fetchProducts();
                                                }
                                            });
                                        }}
                                    >
                                        <IoTrashSharp className='text-xl' />{/* Delete */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center" style={{ backdropFilter: 'blur(5px)' }}>
                        <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                            <InputProduct onAdded={fetchProducts} />
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-6 bg-gray-200 text-gray-600 rounded-full w-8 h-8 text-xl flex items-center justify-center hover:bg-gray-300 transition"
                            >
                                x
                            </button>
                        </div>
                    </div>
                )}
                {isOpenedit && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center" style={{ backdropFilter: 'blur(5px)' }}>
                        <div className="bg-white p-6 rounded-[60px] w-[800px] text-center shadow-lg relative">
                            <Editproducts pdId={selected} onClose={handleClosePopup} />
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-4 right-6 bg-gray-200 text-gray-600 rounded-full w-8 h-8 text-xl flex items-center justify-center hover:bg-gray-300 transition"
                            >
                                x
                            </button>
                        </div>
                    </div>
                )}

                {productsTemp.length === 0 && (
                    <div className="text-gray-500 text-center mt-8">ไม่มีข้อมูลสินค้า</div>
                )}
            </div>
        </div>
    );
}

export default Stock;
