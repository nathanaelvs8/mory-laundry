import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { ordersAPI } from '../../services/api';
import { FaShoppingCart, FaClock, FaCheckCircle, FaPlus, FaWhatsapp, FaEye, FaTimes } from 'react-icons/fa';
import './CustomerDashboard.css';

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
            {/* Stats - 3 items in a row on mobile */}
            <div className="stats-grid customer-stats">
                <div className="stat-card">
                    <div className="stat-icon gold"><FaShoppingCart /></div>
                    <div>
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Pesanan</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange"><FaClock /></div>
                    <div>
                        <div className="stat-value">{stats.active}</div>
                        <div className="stat-label">Pesanan Aktif</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green"><FaCheckCircle /></div>
                    <div>
                        <div className="stat-value">{stats.completed}</div>
                        <div className="stat-label">Selesai</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons - stack on mobile */}
            <div className="action-buttons">
                <Link to="/customer/orders/new" className="action-btn-card gold">
                    <div className="action-btn-icon"><FaPlus /></div>
                    <div className="action-btn-text">
                        <h3>Buat Pesanan Baru</h3>
                        <p>Pesan layanan laundry</p>
                    </div>
                </Link>
                <a href="https://wa.me/6281217607101" target="_blank" rel="noreferrer" className="action-btn-card green">
                    <div className="action-btn-icon"><FaWhatsapp /></div>
                    <div className="action-btn-text">
                        <h3>Hubungi Kami</h3>
                        <p>Chat via WhatsApp</p>
                    </div>
                </a>
            </div>

            {/* Table - scrollable horizontally */}
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Pesanan Terbaru</h3>
                    <Link to="/customer/orders" className="btn btn-primary btn-sm">Lihat Semua</Link>
                </div>
                <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{minWidth: 500}}>
                        <thead>
                            <tr>
                                <th>No. Order</th>
                                <th>Tanggal</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                            ) : recentOrders.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</td></tr>
                            ) : recentOrders.map(o => (
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