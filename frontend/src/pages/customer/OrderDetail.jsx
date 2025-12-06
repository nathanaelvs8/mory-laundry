import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api.js';
import { FaArrowLeft, FaPrint, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

const CustomerOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadOrder(); }, [id]);

    const loadOrder = async () => {
        try {
            const res = await ordersAPI.getById(id);
            setOrder(res.data.data);
        } catch (err) { toast.error('Gagal memuat data'); }
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

    if (loading) return <DashboardLayout title="Detail Pesanan"><div>Loading...</div></DashboardLayout>;
    if (!order) return <DashboardLayout title="Detail Pesanan"><div>Pesanan tidak ditemukan</div></DashboardLayout>;

    return (
        <DashboardLayout title="Detail Pesanan">
            <div style={{marginBottom: 20}}>
                <Link to="/customer/orders" className="btn btn-secondary btn-sm"><FaArrowLeft /> Kembali</Link>
                <button className="btn btn-primary btn-sm" style={{marginLeft: 10}} onClick={() => window.print()}><FaPrint /> Cetak</button>
            </div>

            <div className="table-container" style={{padding: 30}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 30, paddingBottom: 20, borderBottom: '2px solid #eee'}}>
                    <div>
                        <img src="/images/logo.png" alt="Mory Laundry" style={{height: 50, marginBottom: 10}} />
                        <p style={{color: '#666', fontSize: 14, margin: 0}}>Jl. MT Haryono No. 4C, Sukasari, Tangerang</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <h2 style={{margin: 0, color: 'var(--gold)'}}>INVOICE</h2>
                        <p style={{fontSize: 18, fontWeight: 'bold', margin: '5px 0'}}>{order.order_number}</p>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </div>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30}}>
                    <div><h4 style={{marginBottom: 10}}>Info Pelanggan</h4><p style={{margin: '5px 0'}}><strong>Nama:</strong> {order.customer_name}</p><p style={{margin: '5px 0'}}><strong>No. HP:</strong> {order.phone_number}</p></div>
                    <div><h4 style={{marginBottom: 10}}>Info Pesanan</h4><p style={{margin: '5px 0'}}><strong>Tanggal:</strong> {formatDate(order.entry_date)}</p></div>
                </div>

                <table>
                    <thead><tr><th>Layanan</th><th style={{textAlign: 'center'}}>Jumlah</th><th style={{textAlign: 'right'}}>Harga</th><th style={{textAlign: 'right'}}>Subtotal</th></tr></thead>
                    <tbody>
                        {order.items?.map((item, i) => (
                            <tr key={i}>
                                <td>{item.service_name}</td>
                                <td style={{textAlign: 'center'}}>{item.quantity} {item.unit}</td>
                                <td style={{textAlign: 'right'}}>Rp {formatPrice(item.price)}</td>
                                <td style={{textAlign: 'right'}}>Rp {formatPrice(item.subtotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr><td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>TOTAL</td><td style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: 'var(--gold)'}}>Rp {formatPrice(order.total_price)}</td></tr>
                    </tfoot>
                </table>

                {order.notes && <div style={{marginTop: 20, padding: 15, background: '#f9f9f9', borderRadius: 8}}><h4 style={{marginBottom: 10}}>Catatan:</h4><p style={{margin: 0, color: '#666'}}>{order.notes}</p></div>}
            </div>

            {order.status === 'Siap Diambil' && (
                <div style={{background: '#e8f5e9', border: '1px solid #4caf50', borderRadius: 12, padding: 20, marginTop: 20, textAlign: 'center'}}>
                    <h3 style={{color: '#2e7d32', marginBottom: 10}}><FaCheckCircle /> Pesanan Siap Diambil!</h3>
                    <p style={{color: '#666', marginBottom: 15}}>Silakan ambil pesanan Anda di outlet Mory Laundry</p>
                    <a href={`https://wa.me/6281383369984?text=Halo,%20saya%20mau%20ambil%20pesanan%20${order.order_number}`} className="btn btn-whatsapp" target="_blank" rel="noreferrer"><FaWhatsapp /> Konfirmasi WhatsApp</a>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CustomerOrderDetail;
