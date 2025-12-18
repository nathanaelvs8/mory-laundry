import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api';
import { FaArrowLeft, FaPrint, FaWhatsapp, FaCheckCircle, FaFilePdf } from 'react-icons/fa';

const CustomerOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrder(); }, [id]);

    const loadOrder = async () => {
        try {
            const res = await ordersAPI.getById(id);
            setOrder(res.data.data);
        } catch (err) { 
            console.error(err);
            toast.error('Gagal memuat data pesanan'); 
        }
        setLoading(false);
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <DashboardLayout title="Detail Pesanan">
                <div style={{textAlign: 'center', padding: 60}}>
                    <div className="spinner"></div>
                    <p style={{marginTop: 15, color: '#666'}}>Memuat data...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!order) {
        return (
            <DashboardLayout title="Detail Pesanan">
                <div style={{textAlign: 'center', padding: 60}}>
                    <h3 style={{color: '#999', marginBottom: 15}}>Pesanan tidak ditemukan</h3>
                    <Link to="/customer/orders" className="btn btn-primary">Kembali ke Daftar Pesanan</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Detail Pesanan">
            <div style={{marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Link to="/customer/orders" className="btn btn-secondary btn-sm"><FaArrowLeft /> Kembali</Link>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}><FaPrint /> Cetak</button>
            </div>

            <div className="table-container print-area" style={{padding: 30}}>
                {/* Header Invoice */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 30, paddingBottom: 20, borderBottom: '2px solid #eee'}}>
                    <div>
                        <img src="/images/logo.png" alt="Mory Laundry" style={{height: 50, marginBottom: 10}} />
                        <p style={{color: '#666', fontSize: 14, margin: 0}}>Jl. MT Haryono No. 4C, Sukasari, Tangerang</p>
                        <p style={{color: '#666', fontSize: 14, margin: '5px 0 0'}}>WA: +62 812-1760-7101</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <h2 style={{margin: 0, color: 'var(--gold)'}}>INVOICE</h2>
                        <p style={{fontSize: 18, fontWeight: 'bold', margin: '5px 0'}}>{order.order_number}</p>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </div>
                </div>

                {/* Info Pelanggan & Pesanan */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30}}>
                    <div style={{background: '#f9f9f9', padding: 20, borderRadius: 10}}>
                        <h4 style={{marginBottom: 15, color: 'var(--gold)'}}>Info Pelanggan</h4>
                        <p style={{margin: '8px 0'}}><strong>Nama:</strong> {order.customer_name}</p>
                        <p style={{margin: '8px 0'}}><strong>No. HP:</strong> {order.phone_number}</p>
                    </div>
                    <div style={{background: '#f9f9f9', padding: 20, borderRadius: 10}}>
                        <h4 style={{marginBottom: 15, color: 'var(--gold)'}}>Info Pesanan</h4>
                        <p style={{margin: '8px 0'}}><strong>Tanggal Masuk:</strong> {formatDate(order.entry_date)}</p>
                        {order.completed_date && <p style={{margin: '8px 0'}}><strong>Tanggal Selesai:</strong> {formatDate(order.completed_date)}</p>}
                    </div>
                </div>

                {/* Tabel Item */}
                <table>
                    <thead>
                        <tr>
                            <th>Layanan</th>
                            <th style={{textAlign: 'center'}}>Jumlah</th>
                            <th style={{textAlign: 'right'}}>Harga</th>
                            <th style={{textAlign: 'right'}}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(order.items || order.details) && (order.items || order.details).length > 0 ? (
                            (order.items || order.details).map((item, i) => (
                                <tr key={i}>
                                    <td>{item.service_name}</td>
                                    <td style={{textAlign: 'center'}}>{item.quantity} {item.unit}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.price)}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.subtotal)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{textAlign: 'center', padding: 20, color: '#999'}}>
                                    Tidak ada item
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>TOTAL</td>
                            <td style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: 'var(--gold)'}}>Rp {formatPrice(order.total_price)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Catatan */}
                {order.notes && (
                    <div style={{marginTop: 20, padding: 15, background: '#fff9e6', borderRadius: 8, border: '1px solid #f0e6cc'}}>
                        <h4 style={{marginBottom: 10, color: '#8b7355'}}>Alamat:</h4>
                        <p style={{margin: 0, color: '#666'}}>{order.notes}</p>
                    </div>
                )}
            </div>

            {/* Notifikasi Siap Diambil */}
            {order.status === 'Siap Diambil' && (
                <div style={{background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 12, padding: 25, marginTop: 20, textAlign: 'center'}}>
                    <h3 style={{color: '#2e7d32', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                        <FaCheckCircle /> Pesanan Siap Diambil!
                    </h3>
                    <p style={{color: '#666', marginBottom: 20}}>Silakan ambil pesanan Anda di outlet Mory Laundry</p>
                    <a href={`https://wa.me/6281217607101?text=Halo,%20saya%20mau%20ambil%20pesanan%20${order.order_number}`} className="btn btn-whatsapp" target="_blank" rel="noreferrer" style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
                        <FaWhatsapp /> Konfirmasi WhatsApp
                    </a>
                </div>
            )}

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
                    .btn, button { display: none !important; }
                }
                .spinner {
                    width: 40px; height: 40px; margin: 0 auto;
                    border: 4px solid #f3f3f3; border-top: 4px solid var(--gold);
                    border-radius: 50%; animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

export default CustomerOrderDetail;