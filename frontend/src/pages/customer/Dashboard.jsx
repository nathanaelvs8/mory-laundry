import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { ordersAPI } from '../../services/api';
import { FaShoppingCart, FaClock, FaCheckCircle, FaPlus, FaWhatsapp, FaEye, FaTimes } from 'react-icons/fa';

const CustomerDashboard = () => {
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ open: false, orderId: null, orderNumber: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await ordersAPI.getMyOrders();
            const orders = res.data.data || [];
            setRecentOrders(orders.slice(0, 5));
            setStats({
                total: orders.length,
                active: orders.filter(o => !['Selesai', 'Dibatalkan'].includes(o.status)).length,
                completed: orders.filter(o => o.status === 'Selesai').length
            });
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const handleCancelOrder = async () => {
        try {
            await ordersAPI.cancelMyOrder(confirmModal.orderId);
            toast.success('Pesanan berhasil dibatalkan');
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan');
        }
    };

    const openCancelModal = (id, orderNumber) => {
        setConfirmModal({ open: true, orderId: id, orderNumber });
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    return (
        <DashboardLayout title="Dashboard">
            <div className="stats-grid">
                <div className="stat-card"><div className="stat-icon gold"><FaShoppingCart /></div><div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Pesanan</div></div></div>
                <div className="stat-card"><div className="stat-icon orange"><FaClock /></div><div><div className="stat-value">{stats.active}</div><div className="stat-label">Pesanan Aktif</div></div></div>
                <div className="stat-card"><div className="stat-icon green"><FaCheckCircle /></div><div><div className="stat-value">{stats.completed}</div><div className="stat-label">Pesanan Selesai</div></div></div>
            </div>

            <div style={{display: 'flex', gap: 15, marginBottom: 25, flexWrap: 'wrap'}}>
                <Link to="/customer/orders/new" style={{textDecoration: 'none', flex: '1 1 250px'}}>
                    <div style={{background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: 12, padding: 20, color: 'white', display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer'}}>
                        <div style={{width: 45, height: 45, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0}}><FaPlus /></div>
                        <div><h3 style={{margin: '0 0 3px', fontSize: 15}}>Buat Pesanan Baru</h3><p style={{margin: 0, opacity: .9, fontSize: 12}}>Pesan layanan laundry</p></div>
                    </div>
                </Link>
                <a href="https://wa.me/6281217607101" target="_blank" rel="noreferrer" style={{textDecoration: 'none', flex: '1 1 250px'}}>
                    <div style={{background: 'linear-gradient(135deg, #25D366, #128C7E)', borderRadius: 12, padding: 20, color: 'white', display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer'}}>
                        <div style={{width: 45, height: 45, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0}}><FaWhatsapp /></div>
                        <div><h3 style={{margin: '0 0 3px', fontSize: 15}}>Hubungi Kami</h3><p style={{margin: 0, opacity: .9, fontSize: 12}}>Chat via WhatsApp</p></div>
                    </div>
                </a>
            </div>

            <div className="table-container">
                <div className="table-header"><h3 className="table-title">Pesanan Terbaru</h3><Link to="/customer/orders" className="btn btn-primary btn-sm">Lihat Semua</Link></div>
                <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{minWidth: 500}}>
                        <thead><tr><th>No. Order</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                        <tbody>
                            {loading ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                            : recentOrders.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</td></tr>
                            : recentOrders.map(o => (
                                <tr key={o.id}>
                                    <td><strong>{o.order_number}</strong></td>
                                    <td>{formatDate(o.entry_date)}</td>
                                    <td>Rp {formatPrice(o.total_price)}</td>
                                    <td><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                                    <td>
                                        <div style={{display: 'flex', gap: 8}}>
                                            <Link to={`/customer/orders/${o.id}`} className="btn btn-primary btn-sm"><FaEye /></Link>
                                            {o.status === 'Antrian' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => openCancelModal(o.id, o.order_number)}><FaTimes /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, orderId: null, orderNumber: '' })}
                onConfirm={handleCancelOrder}
                title="Batalkan Pesanan?"
                message={`Apakah Anda yakin ingin membatalkan pesanan ${confirmModal.orderNumber}?`}
                type="danger"
            />
        </DashboardLayout>
    );
};

export default CustomerDashboard;