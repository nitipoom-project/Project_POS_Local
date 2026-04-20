import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdQrCode2 } from "react-icons/md";

function Managepayment() {
    const [promptpay, setPromptpay] = useState(true);
    const [cash, setCash] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusPmt, setStatusPmt] = useState();
    const [statusCash, setStatusCash] = useState();

    useEffect(() => {
        // console.log("PromptPay status updated:", statusPmt);
        // console.log(promptpay);
    }, [statusPmt]);

    useEffect(() => {
        // console.log("Cash status updated:", statusCash);
        // console.log(cash);
    }, [statusCash]);

    useEffect(() => {
    const fetchPaymentStatus = async () => {
        try {

            const promptpayRes = await fetch('https://projectposserver-production.up.railway.app/api/getpromptpay');
            const promptpayData = await promptpayRes.json();

            const promptpayStatus = promptpayData.data[0].pm_status;

            setPromptpay(promptpayStatus === 1);


            const cashRes = await fetch('https://projectposserver-production.up.railway.app/api/getcash');
            const cashData = await cashRes.json();

            const cashStatus = cashData.data[0].pm_status;

            setCash(cashStatus === 1);


            // console.log("PromptPay:", promptpayStatus);
            // console.log("Cash:", cashStatus);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchPaymentStatus();

}, []);

    const CustomSwitch = ({ isOn, onToggle, activeColor }) => {
        return (
            <div
                onClick={onToggle}
                style={{
                    width: '60px',
                    height: '30px',
                    backgroundColor: isOn ? activeColor : 'red',
                    borderRadius: '30px',
                    padding: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    transition: 'transform 0.3s',
                    transform: isOn ? 'translateX(30px)' : 'translateX(0px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </div>
        );
    };
    

    const updatePromptpay = async (status) => {
        try {
            await axios.put('https://projectposserver-production.up.railway.app/api/updatepromptpay', {
                status: status
            });
            console.log("PromptPay updated:", status);
        } catch (error) {
            console.error("Update PromptPay error:", error);
        }
    };
    const updateCash = async (status) => {
        try {
            await axios.put('https://projectposserver-production.up.railway.app/api/updatecash', {
                status: status
            });
            console.log("Cash updated:", status);
        } catch (error) {
            console.error("Update Cash error:", error);
        }
    };

    const handleTogglePromptpay = () => {
        const newValue = !promptpay;
        setPromptpay(newValue);

        const status = newValue ? 1 : 0;
        setStatusPmt(status);

        updatePromptpay(status);
    };

    const handleToggleCash = () => {
        const newValue = !cash;
        setCash(newValue);

        const status = newValue ? 1 : 0;
        setStatusCash(status);

        updateCash(status);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                <h2 style={{ marginBottom: '20px', color: '#333' }}>ตั้งค่าการชำระเงิน</h2>

                {/* Card: PromptPay */}
                <div style={cardStyle}>
                    <div style={infoGroupStyle}>
                        <MdQrCode2 style={{ fontSize: '30px', color: '#7c3aed', marginRight: '15px' }} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>PromptPay</div>
                            <div style={{ color: promptpay ? '#059669' : 'red', fontSize: '14px' }}>
                                {promptpay ? 'เปิดการใช้งานแล้ว' : 'ปิดการใช้งานอยู่'}
                                {/* {promptpay && <div style={{ fontSize: '12px', color: '#555' }}>QR Code: 0123456789</div>} */}
                            </div>
                        </div>
                    </div>
                    <CustomSwitch
                        isOn={promptpay}
                        // onToggle={() => setPromptpay(!promptpay)}
                        onToggle={handleTogglePromptpay}
                        activeColor="#10b981"
                    // handleTogglePromptpay={handleTogglePromptpay}
                    />
                </div>

                {/* Card: Cash */}
                <div style={cardStyle}>
                    <div style={infoGroupStyle}>
                        <FaMoneyBillWave style={{ fontSize: '30px', color: '#10b981', marginRight: '15px' }} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>เงินสด (Cash)</div>
                            <div style={{ color: cash ? '#059669' : 'red', fontSize: '14px' }}>
                                {cash ? 'เปิดการใช้งานแล้ว' : 'ปิดการใช้งานอยู่'}
                            </div>
                        </div>
                    </div>
                    <CustomSwitch
                        isOn={cash}
                        // onToggle={() => setCash(!cash)}
                        onToggle={handleToggleCash}
                        activeColor="#10b981"
                    // handleToggleCash={handleToggleCash}
                    />
                </div>

            </div>
        </div>
    );
}

// Styles
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '20px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
};

const infoGroupStyle = {
    display: 'flex',
    alignItems: 'center'
};

export default Managepayment;