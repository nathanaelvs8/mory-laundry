import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api.js';
import { FaShoppingCart, FaCheckCircle, FaClock, FaUsers, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalUsers: 0, totalRevenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsRes, ordersRes] = await Promise.all([
                ordersAPI.getStats(),
                ordersAPI.getAll()
            ]);
            setStats(statsRes.data.data);
            setRecentOrders(ordersRes.data.data.slice(0, 5));
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
                <div className="stat-card">
                    <div className="stat-icon gold"><FaShoppingCart /></div>
                    <div><div className="stat-value">{stats.totalOrders}</div><div className="stat-label">Total Pesanan</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><FaCheckCircle /></div>
                    <div><div className="stat-value">{stats.completedOrders}</div><div className="stat-label">Pesanan Selesai</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><FaClock /></div>
                    <div><div className="stat-value">{stats.pendingOrders}</div><div className="stat-label">Dalam Proses</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue"><FaUsers /></div>
                    <div><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Pelanggan</div></div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Pesanan Terbaru</h3>
                    <Link to="/admin/orders" className="btn btn-primary btn-sm">Lihat Semua</Link>
                </div>
                <table>
                    <thead>
                        <tr><th>No. Order</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        ) : recentOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</td></tr>
                        ) : recentOrders.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.order_number}</strong></td>
                                <td>{order.customer_name}</td>
                                <td>{formatDate(order.entry_date)}</td>
                                <td>Rp {formatPrice(order.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                <td><Link to={`/admin/orders/${order.id}`} className="action-btn edit"><FaEye /></Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
