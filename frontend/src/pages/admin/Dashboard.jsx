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
                
                {/* Desktop Table */}
                <table>
                    <thead>
                        <tr>
                            <th>No. Order</th>
                            <th>Pelanggan</th>
                            <th>Tanggal</th>
                            <th style={{textAlign: 'right'}}>Total</th>
                            <th style={{textAlign: 'center'}}>Status</th>
                            <th style={{width: 120}}>Aksi</th>
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
                                    <Link to={`/admin/orders/${o.id}`} className="btn btn-primary btn-sm" style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 15px'}}>
                                        <FaEye /> Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="mobile-card" style={{padding: 15}}>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: 40}}>Loading...</div>
                    ) : recentOrders.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</div>
                    ) : recentOrders.map(o => (
                        <div key={o.id} className="mobile-card-item">
                            <div className="mobile-card-header">
                                <span className="mobile-card-title">{o.order_number}</span>
                                <span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Pelanggan</span>
                                <span className="mobile-card-value">{o.customer_name}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Tanggal</span>
                                <span className="mobile-card-value">{formatDate(o.entry_date)}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Total</span>
                                <span className="mobile-card-value" style={{fontWeight: 600, color: 'var(--gold)'}}>Rp {formatPrice(o.total_price)}</span>
                            </div>
                            <div className="mobile-card-actions">
                                <Link to={`/admin/orders/${o.id}`} className="btn btn-primary btn-sm">
                                    <FaEye /> Detail
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;