import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api.js';
import { FaShoppingCart, FaClock, FaCheckCircle, FaPlus, FaWhatsapp, FaEye } from 'react-icons/fa';

const CustomerDashboard = () => {
    const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await ordersAPI.getMyOrders();
            const orders = res.data.data;
            setRecentOrders(orders.slice(0, 5));
            setStats({
                total: orders.length,
                active: orders.filter(o => !['Selesai', 'Dibatalkan'].includes(o.status)).length,
                completed: orders.filter(o => o.status === 'Selesai').length
            });
        } catch (err) { console.error(err); }
        setLoading(false);
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

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 30}}>
                <Link to="/customer/orders/new" style={{textDecoration: 'none'}}>
                    <div style={{background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: 12, padding: 30, color: 'white', display: 'flex', alignItems: 'center', gap: 20, transition: 'transform .3s'}}>
                        <div style={{width: 60, height: 60, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}><FaPlus /></div>
                        <div><h3 style={{margin: '0 0 5px', fontSize: 20}}>Buat Pesanan Baru</h3><p style={{margin: 0, opacity: .9, fontSize: 14}}>Pesan layanan laundry sekarang</p></div>
                    </div>
                </Link>
                <a href="https://wa.me/6281383369984" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>
                    <div style={{background: 'linear-gradient(135deg, #25D366, #128C7E)', borderRadius: 12, padding: 30, color: 'white', display: 'flex', alignItems: 'center', gap: 20}}>
                        <div style={{width: 60, height: 60, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}><FaWhatsapp /></div>
                        <div><h3 style={{margin: '0 0 5px', fontSize: 20}}>Hubungi Kami</h3><p style={{margin: 0, opacity: .9, fontSize: 14}}>Chat via WhatsApp</p></div>
                    </div>
                </a>
            </div>

            <div className="table-container">
                <div className="table-header"><h3 className="table-title">Pesanan Terbaru</h3><Link to="/customer/orders" className="btn btn-primary btn-sm">Lihat Semua</Link></div>
                <table>
                    <thead><tr><th>No. Order</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        : recentOrders.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan. <Link to="/customer/orders/new" style={{color: 'var(--gold)'}}>Buat pesanan pertama!</Link></td></tr>
                        : recentOrders.map(o => (
                            <tr key={o.id}>
                                <td><strong>{o.order_number}</strong></td>
                                <td>{formatDate(o.entry_date)}</td>
                                <td>Rp {formatPrice(o.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                                <td><Link to={`/customer/orders/${o.id}`} className="action-btn edit"><FaEye /> Detail</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default CustomerDashboard;
