import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api';
import { FaPlus, FaEye, FaSearch } from 'react-icons/fa';

const CustomerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const res = await ordersAPI.getMyOrders();
            setOrders(res.data.data);
        } catch (err) { console.error(err); }
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

    const filteredOrders = orders.filter(o => 
        o.order_number.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout title="Riwayat Pesanan">
            <Link to="/customer/orders/new" className="btn btn-primary" style={{marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8}}>
                <FaPlus /> Buat Pesanan Baru
            </Link>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Riwayat Pesanan</h3>
                    <div className="search-box" style={{width: '100%', maxWidth: 300, marginTop: 10}}>
                        <FaSearch />
                        <input type="text" placeholder="Cari pesanan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* Desktop Table */}
                <table>
                    <thead>
                        <tr>
                            <th>No. Order</th>
                            <th>Tanggal</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th style={{width: 120}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: 40, color: '#999'}}>
                                {search ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
                            </td></tr>
                        ) : filteredOrders.map(o => (
                            <tr key={o.id}>
                                <td><strong>{o.order_number}</strong></td>
                                <td>{formatDate(o.entry_date)}</td>
                                <td>Rp {formatPrice(o.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                                <td>
                                    <Link to={`/customer/orders/${o.id}`} className="btn btn-primary btn-sm" style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 15px'}}>
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
                    ) : filteredOrders.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 40, color: '#999'}}>
                            {search ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
                        </div>
                    ) : filteredOrders.map(o => (
                        <div key={o.id} className="mobile-card-item">
                            <div className="mobile-card-header">
                                <span className="mobile-card-title">{o.order_number}</span>
                                <span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span>
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
                                <Link to={`/customer/orders/${o.id}`} className="btn btn-primary btn-sm">
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

export default CustomerOrders;