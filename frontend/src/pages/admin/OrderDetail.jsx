import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { ordersAPI } from '../../services/api';
import { FaArrowLeft, FaPrint, FaWhatsapp } from 'react-icons/fa';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ open: false, status: '' });

    useEffect(() => { loadOrder(); }, [id]);

    const loadOrder = async () => {
        try {
            const res = await ordersAPI.getById(id);
            setOrder(res.data.data);
        } catch (err) { toast.error('Gagal memuat data pesanan'); }
        setLoading(false);
    };

    const handleUpdateStatus = async () => {
        try {
            await ordersAPI.updateStatus(id, confirmModal.status);
            toast.success('Status berhasil diupdate');
            loadOrder();
        } catch (err) { toast.error('Gagal update status'); }
    };

    const openConfirmModal = (status) => {
        setConfirmModal({ open: true, status });
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    const handlePrint = () => window.print();

    const handleWhatsApp = () => {
        const message = `Halo ${order.customer_name}, pesanan laundry Anda dengan nomor ${order.order_number} sudah ${order.status.toLowerCase()}. Total: Rp ${formatPrice(order.total_price)}. Terima kasih telah menggunakan Mory Laundry!`;
        window.open(`https://wa.me/62${order.phone_number?.replace(/^0/, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <DashboardLayout title="Detail Pesanan"><div style={{textAlign: 'center', padding: 60}}>Loading...</div></DashboardLayout>;
    if (!order) return <DashboardLayout title="Detail Pesanan"><div style={{textAlign: 'center', padding: 60}}>Pesanan tidak ditemukan</div></DashboardLayout>;

    const statusList = ['Antrian', 'Proses Cuci', 'Proses Kering', 'Setrika', 'Siap Diambil', 'Selesai', 'Dibatalkan'];

    return (
        <DashboardLayout title="Detail Pesanan">
            <div style={{marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Link to="/admin/orders" className="btn btn-secondary btn-sm"><FaArrowLeft /> Kembali</Link>
                <button className="btn btn-primary btn-sm" onClick={handlePrint}><FaPrint /> Cetak</button>
                <button className="btn btn-whatsapp btn-sm" onClick={handleWhatsApp} style={{background: '#25D366'}}><FaWhatsapp /> WA</button>
            </div>

            <div className="table-container print-area" style={{padding: 30}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 30, paddingBottom: 20, borderBottom: '2px solid #eee', flexWrap: 'wrap', gap: 15}}>
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

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30}}>
                    <div style={{background: '#f9f9f9', padding: 20, borderRadius: 10}}>
                        <h4 style={{marginBottom: 15, color: 'var(--gold)', fontSize: 14}}>Info Pelanggan</h4>
                        <p style={{margin: '8px 0', fontSize: 14}}><strong>Nama:</strong> {order.customer_name}</p>
                        <p style={{margin: '8px 0', fontSize: 14}}><strong>No. HP:</strong> {order.phone_number}</p>
                    </div>
                    <div style={{background: '#f9f9f9', padding: 20, borderRadius: 10}}>
                        <h4 style={{marginBottom: 15, color: 'var(--gold)', fontSize: 14}}>Info Pesanan</h4>
                        <p style={{margin: '8px 0', fontSize: 14}}><strong>Tanggal Masuk:</strong> {formatDate(order.entry_date)}</p>
                        {order.completed_date && <p style={{margin: '8px 0', fontSize: 14}}><strong>Tanggal Selesai:</strong> {formatDate(order.completed_date)}</p>}
                    </div>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table style={{marginBottom: 20}}>
                        <thead><tr><th>Layanan</th><th style={{textAlign: 'center'}}>Jumlah</th><th style={{textAlign: 'right'}}>Harga</th><th style={{textAlign: 'right'}}>Subtotal</th></tr></thead>
                        <tbody>
                            {(order.items || order.details)?.length > 0 ? (order.items || order.details).map((item, i) => (
                                <tr key={i}>
                                    <td>{item.service_name}</td>
                                    <td style={{textAlign: 'center'}}>{item.quantity} {item.unit}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.price)}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.subtotal)}</td>
                                </tr>
                            )) : <tr><td colSpan="4" style={{textAlign: 'center', padding: 20, color: '#999'}}>Tidak ada item</td></tr>}
                        </tbody>
                        <tfoot><tr><td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>TOTAL</td><td style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: 'var(--gold)'}}>Rp {formatPrice(order.total_price)}</td></tr></tfoot>
                    </table>
                </div>

                {order.notes && <div style={{marginTop: 20, padding: 15, background: '#fff9e6', borderRadius: 8}}><h4 style={{marginBottom: 10, color: '#8b7355'}}>Catatan:</h4><p style={{margin: 0, color: '#666'}}>{order.notes}</p></div>}
            </div>

            {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                <div className="table-container no-print" style={{padding: 20, marginTop: 20}}>
                    <h4 style={{marginBottom: 15, fontSize: 16}}>Update Status Pesanan</h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 10
                    }}>
                        {statusList.map(s => (
                            <button 
                                key={s} 
                                className={`btn ${order.status === s ? 'btn-primary' : 'btn-outline'} btn-sm`} 
                                onClick={() => openConfirmModal(s)} 
                                disabled={order.status === s}
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    fontSize: 12,
                                    padding: '10px 8px'
                                }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <ConfirmModal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, status: '' })} onConfirm={handleUpdateStatus} title="Update Status?" message={`Ubah status pesanan menjadi "${confirmModal.status}"?`} type="warning" />

            <style>{`@media print { body * { visibility: hidden; } .print-area, .print-area * { visibility: visible; } .print-area { position: absolute; left: 0; top: 0; width: 100%; } .no-print { display: none !important; } }`}</style>
        </DashboardLayout>
    );
};

export default AdminOrderDetail;