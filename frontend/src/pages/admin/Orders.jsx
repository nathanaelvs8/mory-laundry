import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api.js';
import { FaSearch, FaEye, FaPrint, FaSync } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => { loadOrders(); }, [filterStatus]);

    const loadOrders = async () => {
        try {
            const res = await ordersAPI.getAll({ status: filterStatus || undefined });
            setOrders(res.data.data);
        } catch (err) { toast.error('Gagal memuat data'); }
        setLoading(false);
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm(`Update status menjadi "${newStatus}"?`)) return;
        try {
            await ordersAPI.updateStatus(id, newStatus);
            toast.success('Status berhasil diupdate');
            loadOrders();
        } catch (err) { toast.error('Gagal update status'); }
    };

    const filtered = orders.filter(o => 
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(search.toLowerCase())
    );

    const statuses = ['Antrian', 'Proses Cuci', 'Proses Kering', 'Setrika', 'Siap Diambil', 'Selesai', 'Dibatalkan'];

    return (
        <DashboardLayout title="Kelola Pesanan">
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Daftar Pesanan</h3>
                    <div className="table-actions">
                        <div className="search-box">
                            <FaSearch /><input type="text" placeholder="Cari pesanan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select className="form-control" style={{width: 'auto', padding: '10px 15px'}} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="">Semua Status</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><FaPrint /> Cetak</button>
                    </div>
                </div>
                <table>
                    <thead><tr><th>No. Order</th><th>Pelanggan</th><th>No. HP</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="7" style={{textAlign: 'center', padding: 40, color: '#999'}}>Tidak ada pesanan</td></tr>
                        ) : filtered.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.order_number}</strong></td>
                                <td>{order.customer_name}</td>
                                <td>{order.phone_number}</td>
                                <td>{formatDate(order.entry_date)}</td>
                                <td>Rp {formatPrice(order.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                <td>
                                    <Link to={`/admin/orders/${order.id}`} className="action-btn edit"><FaEye /></Link>
                                    {order.status !== 'Selesai' && order.status !== 'Dibatalkan' && (
                                        <select 
                                            className="form-control" 
                                            style={{width: 'auto', padding: '5px 10px', fontSize: 12, display: 'inline-block', marginLeft: 5}}
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminOrders;
