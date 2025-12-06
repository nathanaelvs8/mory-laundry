import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api.js';
import { FaPlus, FaSearch, FaEye } from 'react-icons/fa';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const res = await ordersAPI.getMyOrders();
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

    const filtered = orders.filter(o => o.order_number.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout title="Riwayat Pesanan">
            <div style={{marginBottom: 20}}>
                <Link to="/customer/orders/new" className="btn btn-primary"><FaPlus /> Buat Pesanan Baru</Link>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Riwayat Pesanan</h3>
                    <div className="search-box"><FaSearch /><input type="text" placeholder="Cari pesanan..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                </div>
                <table>
                    <thead><tr><th>No. Order</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        : filtered.length === 0 ? <tr><td colSpan="5" style={{textAlign: 'center', padding: 40, color: '#999'}}>Belum ada pesanan</td></tr>
                        : filtered.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.order_number}</strong></td>
                                <td>{formatDate(order.entry_date)}</td>
                                <td>Rp {formatPrice(order.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                                <td><Link to={`/customer/orders/${order.id}`} className="action-btn edit"><FaEye /> Detail</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default CustomerOrders;
