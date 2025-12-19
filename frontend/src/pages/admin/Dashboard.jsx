import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI, usersAPI } from '../../services/api';
import { FaShoppingCart, FaCheckCircle, FaClock, FaUsers, FaEye } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, completed: 0, processing: 0, customers: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [ordersRes, usersRes] = await Promise.all([
                ordersAPI.getAll(),
                usersAPI.getAll()
            ]);
            const orders = ordersRes.data.data || [];
            const users = usersRes.data.data || [];
            
            setRecentOrders(orders.slice(0, 5));
            setStats({
                total: orders.length,
                completed: orders.filter(o => o.status === 'Selesai').length,
                processing: orders.filter(o => !['Selesai', 'Dibatalkan', 'Antrian'].includes(o.status)).length,
                customers: users.filter(u => u.role === 'pelanggan').length
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
                <div className="stat-card">
                    <div className="stat-icon gold"><FaShoppingCart /></div>
                    <div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Pesanan</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><FaCheckCircle /></div>
                    <div><div className="stat-value">{stats.completed}</div><div className="stat-label">Pesanan Selesai</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><FaClock /></div>
                    <div><div className="stat-value">{stats.processing}</div><div className="stat-label">Dalam Proses</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><FaUsers /></div>
                    <div><div className="stat-value">{stats.customers}</div><div className="stat-label">Total Pelanggan</div></div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Pesanan Terbaru</h3>
                    <Link to="/admin/orders" className="btn btn-primary btn-sm">Lihat Semua</Link>
                </div>
                
                {/* Table dengan scroll horizontal di mobile */}
                <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{minWidth: 600}}>
                        <thead>
                            <tr>
                                <th>No. Order</th>
                                <th>Pelanggan</th>
                                <th>Tanggal</th>
                                <th style={{textAlign: 'right'}}>Total</th>
                                <th style={{textAlign: 'center'}}>Status</th>
                                <th style={{width: 100}}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                            ) : recentOrders.length === 0 ? (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</td></tr>
                            ) : recentOrders.map(o => (
                                <tr key={o.id}>
                                    <td><strong>{o.order_number}</strong></td>
                                    <td>{o.customer_name}</td>
                                    <td>{formatDate(o.entry_date)}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(o.total_price)}</td>
                                    <td style={{textAlign: 'center'}}><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                                    <td>
                                        <Link to={`/admin/orders/${o.id}`} className="btn btn-primary btn-sm" style={{padding: '6px 12px'}}>
                                            <FaEye /> Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;