import React, { useState, useEffect, use } from "react";
import axios from "axios";
import '../output.css';
import { VscGraphLine } from "react-icons/vsc";
import PieChartExample from "../chart/Pai";
import BarChartExample from "../chart/Bar";
import ProfittoMonth from "./ProfittoMonth";

function Report() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalsales, setTotalsales] = useState([]);
    const [profit, setProfit] = useState([]);
    const [bill, setBill] = useState([]);
    const [dateTime, setDateTime] = useState(new Date());
    const [rptoday, setRptoday] = useState([]);
    const now = new Date();
    const formatted = now.toISOString().slice(0, 10);

    console.log(formatted); // 2026-03-20

    useEffect(() => {
        console.log("👉 rptoday updated:", rptoday);
    }, [rptoday]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://projectposserver-production.up.railway.app/api/showproducts');
                setProducts(response.data.data || []);
            } catch (error) {
                setProducts([]);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);


    useEffect(() => {
    const fetchMonthly = async () => {
        try {
            const now = new Date();
            const date = now.toISOString().slice(0, 10); // 🔥 ได้ YYYY-MM
            const response = await axios.get(`https://projectposserver-production.up.railway.app/api/sales_by_day/${date}`);
            setRptoday(response.data.data || []);
            console.log(response.data);
            // console.log('date:', date);

        } catch (error) {
            console.error(error);
            setRptoday([]);
        }
    };

    fetchMonthly();
}, []);

    return (
        <div className="max-w-7xl mx-auto px-4">

            <div className="w-full mx-auto bg-white rounded-lg shadow-lg mt-8 pb-4">
                <div className="justify-between items-center mb-8 px-8 pt-8">
                    <h1 className="flex text-4xl font-bold text-blue-700 gap-2">
                        <div className="text-4xl text-blue-700 mt-1">
                            <VscGraphLine />
                        </div>
                        Report
                    </h1>
                    <h1 className=" text-2xl font-bold gap-2">
                        {/* <div className="text-4xl text-blue-700 mt-1">
                            <VscGraphLine />
                        </div> */}
                        <p>{dateTime.toLocaleDateString("th-TH")}</p>
                    </h1>
                    {/* <p>วันที่: {dateTime.toLocaleDateString("th-TH")}</p> */}
                    <div className="flex flex-wrap mt-4">

                        <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                            <h1 className="text-xl">สินค้าทั้งหมดภายในร้าน</h1>
                            <div className="text-2xl font-bold ">
                                <p>จำนวนสินค้า: {products.length}</p>
                            </div>
                        </div>
                        <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                            <h1 className="text-xl">รายการบิลทั้งหมด</h1>
                            <div className="text-2xl font-bold ">
                                <p>จำนวนบิล: {rptoday[0]?.total_bill || 0}</p>
                            </div>
                        </div>
                        <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3">
                            <h1 className="text-xl">ยอดขายรวม</h1>
                            <div className="text-2xl font-bold ">
                                <p>{Number(rptoday[0]?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                            </div>
                        </div>
                        <div className="w-65 h-24 mt-8 rounded-lg shadow-lg text-right border-gray-300 mx-2 mb-4 p-3 ">
                            <h1 className="text-xl">กำไรหลักจากหักค่าใช้จ่าย</h1>
                            <div className="text-2xl font-bold text-white border border-black stocks-black-5 bg-green-400 p-2 rounded-lg">
                                <p>{Number(rptoday[0]?.profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-wrap mt-4">
                    <div className="mb-8 px-8">
                        <PieChartExample />
                    </div>
                    <div className="mb-8 px-8">
                        <ProfittoMonth />
                    </div>
                    {/* <div className="mb-8 px-8">
                    <BarChartExample />
                </div> */}
                </div>
            </div>
        </div>
    );
}

export default Report;
