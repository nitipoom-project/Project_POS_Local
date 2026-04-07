import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import QRCode from "qrcode";
import promptpay from 'promptpay-qr';
import logo from './img/prompt-pay-logo.png';
import Swal from 'sweetalert2';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import "./font/THSarabunNew-normal.js";

function Payment({ total, selected, onClose, onSuccess }) {
    const [product, setProduct] = useState(selected || []);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [cashMethod, setCashMethod] = useState(false);
    const [dateTime, setDateTime] = useState(new Date());
    const [shopaddress, setShopaddress] = useState({});
    const userId = localStorage.getItem("user_id");
    const [promptpays, setPromptpays] = useState(true);
    const [cash, setCash] = useState(true);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [qrImage, setQrImage] = useState("");
    const [money, setMoney] = useState(0);
    const [head, setHead] = useState("ชำระเงิน")

    const phone = "0819077307"; // เบอร์ PromptPay

    const generateQR = async () => {
        try {
            const qrData = promptpay(phone, { amount: total });
            const qr = await QRCode.toDataURL(qrData);
            setQrImage(qr);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchShop = async () => {
        try {
            const response = await axios.get('https://projectposserver-production.up.railway.app/api/shop_address');
            setShopaddress(response.data.data || []);
        } catch (error) {
            console.error('Error fetching shop data:', error);
        }
    };
    useEffect(() => {
        fetchShop();
    }, []);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {

                const promptpayRes = await fetch('https://projectposserver-production.up.railway.app/api/getpromptpay');
                const promptpayData = await promptpayRes.json();

                const promptpayStatus = promptpayData.data[0].pm_status;

                setPromptpays(promptpayStatus === 1);


                const cashRes = await fetch('https://projectposserver-production.up.railway.app/api/getcash');
                const cashData = await cashRes.json();

                const cashStatus = cashData.data[0].pm_status;

                setCash(cashStatus === 1);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();

    }, []);

    const printToLinux = async (data, billNo, total, moneyValue) => {
        try {
            // เปลี่ยนเป็น IP ของเครื่อง Pi และ Port 3001
            await fetch("https://enterable-contextured-kelvin.ngrok-free.dev/print", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // ส่งชื่อร้านไปจากที่นี่เพื่อแก้ปัญหาภาษาไทย ? บน Linux
                    storeName: shopaddress[0]?.shop_name || "POS SHOP",
                    billNo: billNo,
                    items: data.map(item => ({
                        name: item.product_name,
                        qty: item.quantity,
                        price: item.product_price
                    })),
                    total: total,
                    money: moneyValue // ส่งยอดเงินที่รับมาเพื่อคำนวณเงินทอนในใบเสร็จ
                })
            });
        } catch (err) {
            console.error("Print error:", err);
            // อาจจะเพิ่ม Swal.fire เพื่อแจ้งเตือนว่าเชื่อมต่อเครื่องพิมพ์ไม่ได้
        }
    };

    const handlePayment = (method) => {
        // Handle payment logic here
        generateQR();
        setPaymentMethod(true);
    };

    const handleCash = () => {
        setCashMethod(true);
        // setHead("ชำระแบบ เงินสด")
    }

    const handleClose = () => {
        setCashMethod(false);
        setPaymentMethod(false);
        // setProduct(selected || []);
        setMoney(0);
        setHead("ชำระเงิน")
    }

    const handleMoney = async () => {
        if (money >= total) {
            const newBillNo = generateBillNo();
            setBillNo(newBillNo);

            const sum = (money - total);
            const updatedProducts = product.map(item => ({
                ...item,
                billNo: newBillNo,
                total: total,
                cash: Number(money).toFixed(2),
                paymentStatus: "paid",
                paymentMethod: "cash",
                paidDate: dateTime.toLocaleDateString("th-TH"),
                paidTime: dateTime.toLocaleTimeString("th-TH")
            }));
            // console.log(updatedProducts);
            Swal.fire({
                title: "ชำระเงินเรียบร้อย",
                text: 'เงินทอน ' + Number(sum).toLocaleString('en-US', { minimumFractionDigits: 2 }) + ' ฿',
                icon: "success",
                showConfirmButton: false,
                draggable: true,
                timer: 1500
            });
            BillItem(newBillNo);
            ReportBill(newBillNo);
            generatePDF(updatedProducts, newBillNo, shopaddress);
            printToLinux(updatedProducts, newBillNo, total, money);
            // setIsOpen1(false);
            // ใส่ฟังก์ชันบันทึกการชำระเงินตรงนี้
            if (onSuccess) onSuccess();
        } else {
            Swal.fire({
                title: "จำนวนเงินไม่พอ",
                icon: "error",
                showConfirmButton: false,
                draggable: true,
                timer: 1500
            });
        }
    }

    const handle_Payment = async () => {
        const newBillNo = generateBillNo();
        setBillNo(newBillNo);
        setMoney(0);

        const updatedProducts = product.map((item) => ({
            ...item,
            billNo: newBillNo,
            total: total,
            cash: 0,
            paymentStatus: "paid",
            paymentMethod: "payment",
            paidDate: dateTime.toLocaleDateString("th-TH"),
            paidTime: dateTime.toLocaleTimeString("th-TH")
        }));
        Swal.fire({
            title: "ชำระเงินเรียบร้อย",
            icon: "success",
            showConfirmButton: false,
            draggable: true,
            timer: 1500
        });
        BillItem(newBillNo);
        ReportBill(newBillNo);
        generatePDF(updatedProducts, newBillNo, shopaddress);
        printToLinux(updatedProducts, newBillNo, total, total);
        if (onSuccess) onSuccess();
    }

    const [billNo, setBillNo] = useState("");

    // ฟังก์ชันสร้างเลขบิล (เช่น BILL-20250909-0001)
    const generateBillNo = () => {
        const today = new Date();
        const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20250909
        const randomPart = Math.floor(1000 + Math.random() * 9000); // ตัวเลขสุ่ม 4 หลัก
        return `BILL-${datePart}-${randomPart}`;
    };

    useEffect(() => {
        // ตั้ง interval ให้เวลาอัปเดตทุก 1 วินาที
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        // cleanup ตอน component ถูก unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selected && selected.length > 0) {
            // flatten ถ้ามันเป็น array ซ้อน array
            const flat = Array.isArray(selected[0]) ? selected[0] : selected;
            setProduct(flat);
        }
    }, [selected]);

    // useEffect(() => {
    //     if (selected && selected.length > 0) {
    //         setProduct(selected);
    //     }
    // }, [selected]);


    // const BillItem = async () => {
    //     // const newBillNo = generateBillNo();
    //     const billItem = {
    //         billNo: billNo,
    //         user_id: product[0][0]?.user_id || null,
    //         products: product[0].map(item => ({
    //             product_id: item.product_id,
    //             quantity: item.quantity
    //         }))
    //     };

    //     console.log("ส่ง billItem:", billItem);

    //     try {
    //         const response = await axios.post('http://localhost:5000/api/addbillitem', billItem);
    //         console.log('บันทึกข้อมูลบิลลงใน Bill Item สำเร็จ:', response.data);
    //     } catch (error) {
    //         // console.error(error);
    //         alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล billItem: ' + error.message);
    //     }
    // };

    const BillItem = async (newBillNo) => {
        if (!newBillNo) {
            console.error("❌ ไม่มี billNo- BillItem");
            return;
        }

        if (!product || product.length === 0) {
            console.error("❌ ไม่มีสินค้า");
            return;
        }

        const billItem = {
            billNo: newBillNo,
            user_id: userId || null,
            products: product.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        };

        console.log("👉 ส่ง billItem:", billItem);

        try {
            const response = await axios.post("https://projectposserver-production.up.railway.app/api/addbillitem", billItem);
            // console.log("✅ บันทึกข้อมูล BillItem สำเร็จ:", response.data);
        } catch (error) {
            console.error("❌ Error:", error.response?.data || error.message);
            alert("เกิดข้อผิดพลาดในการบันทึก billItem: " + (error.response?.data?.error || error.message));
        }

        try {
            const response = await axios.post('https://projectposserver-production.up.railway.app/api/update_stock', billItem);
            // console.log('อัปเดตสต็อกสำเร็จ:', response.data);
        }
        catch (error) {
            console.error('❌ Error updating stock:', error.response?.data || error.message);
            alert('เกิดข้อผิดพลาดในการอัปเดตสต็อก: ' + (error.response?.data?.error || error.message));
        }
    };

    const ReportBill = async (newBillNo) => {
        if (!newBillNo) {
            console.error("❌ ไม่มี billNo- ReportBill");
            return;
        }

        if (!product || product.length === 0) {
            console.error("❌ ไม่มีสินค้า");
            return;
        }
        const reportData = {
            billNo: newBillNo,
            paymentStatus: "paid",
            paymentMethod: paymentMethod ? "promptpay" : "cash",
            paidDate: dateTime.toISOString().split('T')[0],
            paidTime: dateTime.toLocaleTimeString("th-TH"),
            cash: Number(money),
            total: total,
        }
        console.log("ส่ง ReportBill:", reportData);

        try {
            const response = await axios.post('https://projectposserver-production.up.railway.app/api/reportbill', reportData);
            // console.log('บันทึกข้อมูลบิลลงใน Report_Bill สำเร็จ:', response.data);
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล ReportBill: ' + error.message);
        }
    }
    //----------------------------------------------------------------------------------------------------------------
    // const generatePDF = (data, billNo, Shop) => {
    //     const doc = new jsPDF({
    //         orientation: "p",   // "p" = portrait (แนวตั้ง), "l" = landscape (แนวนอน)
    //         unit: "mm",         // หน่วย: mm, cm, in, px, pt
    //         format: "a4"        // หรือจะใส่ [210, 297] ก็ได้
    //     });

    //     doc.setFontSize(18);
    //     doc.setFont("THSarabunNew", "normal");

    //     // Header ร้านค้า
    //     doc.setFontSize(24);
    //     doc.text(`${shopaddress[0].shop_name}`, 105, 20, { align: "center" });
    //     doc.setFontSize(12);
    //     doc.text(`${shopaddress[0].shop_address}`, 105, 28, { align: "center" });
    //     doc.text(`โทร: ${shopaddress[0].shop_tel}`, 105, 34, { align: "center" });

    //     // ข้อมูลบิล
    //     doc.setFontSize(14);
    //     doc.text(`เลขที่บิล: ${billNo}`, 14, 50);
    //     doc.text(`วันที่: ${dateTime.toLocaleDateString("th-TH")} เวลา: ${dateTime.toLocaleTimeString("th-TH")}`, 14, 58);
    //     doc.text(`ชื่อลูกค้า:           `, 14, 66);
    //     const method = paymentMethod ? "PromptPay" : "เงินสด";
    //     doc.text(`ชำระแบบ: ${method}`, 160, 66);

    //     // doc.setFontSize(16);
    //     doc.text(`ลำดับ                                สินค้า                                 จำนวน                               ราคา                       รวม`, 15, 78);
    //     // ตารางสินค้า
    //     autoTable(doc, {
    //         startY: 80,
    //         // head: [["ลำดับ", "สินค้า", "จำนวน", "ราคา", "รวม"]],
    //         body: [
    //             ...data.map((item, index) => [
    //                 index + 1,
    //                 item.product_name,
    //                 "x" + item.quantity,
    //                 Number(item.product_price).toLocaleString('en-US', { minimumFractionDigits: 2 }),
    //                 Number(item.quantity * item.product_price).toLocaleString('en-US', { minimumFractionDigits: 2 })
    //             ])
    //         ],
    //         styles: { font: "THSarabunNew", fontSize: 12, halign: "center" },
    //         headStyles: { fillColor: [41, 128, 185] },
    //         columnStyles: {
    //             0: { halign: "left" },
    //             1: { halign: "left" },
    //             2: { halign: "right" },
    //             3: { halign: "right" }
    //         }
    //     });

    //     const finalY = doc.lastAutoTable.finalY || 100;
    //     const cash = money - total;
    //     doc.setFontSize(14);
    //     doc.text(`ยอดรวมสุทธิ: ${(Number(total) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 10, { align: "right" });
    //     doc.text(`รับ: ${(Number(money) || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 20, { align: "right" });
    //     doc.text(`เงินทอน: ${(method === "PromptPay" ? 0 : (Number(cash) || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })} บาท`, 195, finalY + 30, { align: "right" });


    //     // Footer
    //     doc.setFontSize(12);
    //     doc.text("ขอบคุณที่ใช้บริการ", 105, finalY + 40, { align: "center" });

    //     doc.save(`${billNo}.pdf`);
    //-------
    const generatePDF = (
        data,
        billNo,
        shopaddress
        // money
        // paymentMethod // true = PromptPay
    ) => {

        // ===== CALC SAFE =====
        const safeMoney = Number(money) || 0;
        const safeTotal = data.reduce(
            (sum, i) =>
                sum +
                (Number(i.quantity) || 0) *
                (Number(i.product_price) || 0),
            0
        );
        const cash = safeMoney - safeTotal;

        // ===== PDF =====
        const doc = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: [43, 100] // ขนาดใบเสร็จ 43mm x 100mms
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const centerX = pageWidth / 2;
        const rightX = pageWidth - 2;
        let y = 6;

        const dateTime = new Date();
        const method = paymentMethod ? "PromptPay" : "เงินสด";

        doc.setFont("THSarabunNew", "normal");

        // ===== HEADER =====
        doc.setFontSize(16);
        doc.text(shopaddress[0].shop_name, centerX, y, { align: "center" });
        y += 5;

        doc.setFontSize(9);
        doc.text(shopaddress[0].shop_address, centerX, y, { align: "center" });
        y += 4;

        doc.text(`โทร: ${shopaddress[0].shop_tel}`, centerX, y, { align: "center" });
        y += 4;

        doc.text("--------------------------------", centerX, y, { align: "center" });
        y += 4;

        // ===== BILL INFO =====
        doc.text(`เลขที่บิล: ${billNo}`, 2, y);
        y += 4;

        doc.text(
            `วันที่: ${dateTime.toLocaleDateString("th-TH-u-ca-gregory")} เวลา: ${dateTime.toLocaleTimeString("th-TH")}`,
            2,
            y
        );
        y += 4;

        doc.text(`ชำระแบบ: ${method}`, 2, y);
        y += 4;

        doc.text("-------------------------------------------------------------", centerX, y, { align: "center" });
        y += 3;


        // ===== TABLE HEADER (เหมือนต้นแบบ) =====
        doc.setFontSize(8);
        doc.text("ลำดับ สินค้า                   จำนวน              รวม", 2, y);
        y += 3;

        doc.text("-----------------------------------------------------------------", centerX, y, { align: "center" });
        y += 2;

        // ===== ITEMS =====
        autoTable(doc, {
            startY: y,
            margin: { left: 1, right: 1 },
            theme: "plain",
            body: data.map((item, index) => [
                index + 1,
                item.product_name,
                `${item.product_price.toFixed(2)}x${item.quantity}`,
                `${(item.quantity * item.product_price).toFixed(2)}฿`
            ]),
            styles: {
                font: "THSarabunNew",
                fontSize: 10,
                cellPadding: 0.5
            },
            columnStyles: {
                0: { cellWidth: 4 },
                1: { cellWidth: 15 },
                2: { cellWidth: 9, halign: "right" },
                3: { cellWidth: 12, halign: "right" }
            }
        });


        y = doc.lastAutoTable.finalY + 3;

        doc.text("--------------------------------", centerX, y, { align: "center" });
        y += 4;

        // ===== TOTAL =====
        doc.setFontSize(9);
        doc.text("ยอดรวมสุทธิ:", 2, y);
        doc.text(`${safeTotal.toFixed(2)} บาท`, rightX, y, { align: "right" });
        y += 4;

        doc.text("รับ/ทอน:", 2, y);
        doc.text(`${safeMoney.toFixed(2)}/${cash.toFixed(2)} บาท`, rightX, y, { align: "right" });
        y += 4;

        // doc.text("เงินทอน:", 2, y);
        // doc.text(
        //     `${method === "PromptPay" ? "0.00" : cash.toFixed(2)} บาท`,
        //     rightX,
        //     y,
        //     { align: "right" }
        // );
        // y += 5;

        // ===== FOOTER =====
        doc.text("--------------------------------", centerX, y, { align: "center" });
        y += 4;
        if (paymentMethod) {
            doc.text("แสกนเพื่อชำระเงิน", centerX, y, { align: "center" });
            y += 2;
            qrImage && doc.addImage(qrImage, "PNG", 11, y, 20, 20);
            y += qrImage ? 25 : 0;
        }
        doc.text("ขอบคุณที่ใช้บริการ", centerX, y, { align: "center" });

        const string = doc.output('bloburl'); // สร้าง URL ของ PDF
        doc.save(`${billNo}.pdf`);
        // doc.autoPrint();
        // window.open(doc.output('bloburl'), '_blank');
        //
        // doc.output("dataurlnewwindow");

    };
    //----------------------------------------------------------------------------------------------------------------

    return (
        <div className="p-8">
            <h2 className='text-xl font-semibold'>- {head} -</h2>
            <div className='mt-4'>
                <h1 className='text-sm'>ยอดที่ต้องชำระ</h1>
                <p className='text-3xl font-bold'>-- {Number(total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿ --</p>
            </div>

            {paymentMethod === false && cashMethod === false && (
                <div className='flex justify-center grid-cols-2 gap-4 mt-4 border-collapse rounded-lg shadow-lg p-8'>

                    {promptpays === true && (
                        <div>
                            <button className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                                onClick={() => handlePayment(total)}
                            >
                                <span className='mt-2'>PromptPay</span>
                                <span className='text-green-600 text-xs mt-1'>เปิดใช้งาน</span>
                            </button>
                        </div>
                    )}
                    {promptpays === false && (
                        <div>
                            <div className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                            // onClick={() => handlePayment(total)}
                            >
                                <span className='mt-2'>PromptPay</span>
                                <span className='text-red-600 text-xs mt-1'>ไม่สามารถใช้ได้</span>
                            </div>
                        </div>
                    )}
                    {cash === true && (
                        <div>
                            <button className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                                onClick={() => handleCash()}
                            >
                                <span className='mt-2'>เงินสด</span>
                                <span className='text-green-600 text-xs mt-1'>เปิดใช้งาน</span>
                            </button>
                        </div>
                    )}
                    {cash === false && (
                        <div>
                            <text className='bg-blue-50 rounded-xl shadow hover:shadow-lg transition p-8 flex flex-col items-center'
                            // onClick={() => handleCash()}
                            >
                                <span className='mt-2'>เงินสด</span>
                                <span className='text-red-600 text-xs mt-1'>ไม่สามารถใช้ได้</span>
                            </text>
                        </div>
                    )}
                </div>
            )}

            {/* {promptpays === false && (
                <div className='mt-8 text-center'>
                    <h2 className='text-xl font-bold mb-4'>ขออภัย ไม่มีวิธีชำระเงินในขณะนี้</h2>
                </div>
            )} */}

            {paymentMethod === true && (
                <div className="mt-8 text-center">
                    <h2 className="text-xl font-bold mb-4">สแกนเพื่อชำระเงิน</h2>
                    {/* ตรงนี้คุณใส่ QR Code หรือรายละเอียดการจ่าย */}
                    <img src={qrImage} alt="QR Code" className="mx-auto w-64 h-64" />
                    <div className='flex justify-center items-center'>
                        <img src={logo} alt="PromptPay Logo" className="mx-auto mt-4"
                            style={{ height: '70px', objectFit: 'cover' }}
                        />
                    </div>
                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleClose()} // กดปิด
                    >
                        กลับไปเลือกวิธีชำระ
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            handle_Payment();
                            // generatePDF(product, billNo);
                        }}
                    // กดชำระเงิน
                    >
                        ชำระเงิน
                    </button>
                </div>
            )}


            {cashMethod === true && (
                <div className="mt-8 border-gray-300 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">เงินสด</h2>

                    <div className='gap-2 text-left'>
                        <label>รับมา : </label>
                        <input
                            type='text'
                            value={money}
                            onChange={(e) => setMoney(e.target.value)}
                        />฿
                    </div>

                    {money < total && money > 0 && (
                        <p className="text-red-500 mb-2">จำนวนเงินไม่พอ</p>
                    )}

                    {money >= total && (
                        <p className="text-green-500 mb-2">เงินทอน: {Number(money - total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ฿</p>
                    )}

                    <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => handleClose()} // กดปิด
                    >
                        กลับไปเลือกวิธีชำระ
                    </button>
                    &nbsp;&nbsp;
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                            handleMoney(money);
                            // generatePDF(product, billNo);
                        }}
                    >
                        ชำระเงิน
                    </button>
                </div>
            )}
            <p>วันที่: {dateTime.toLocaleDateString("th-TH")}</p>
            <p>เวลา: {dateTime.toLocaleTimeString("th-TH")}</p>
        </div>
    );
}

export default Payment;