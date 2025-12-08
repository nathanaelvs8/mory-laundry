import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const res = await ordersAPI.getAll();
            setOrders(res.data.data || []);
        } catch (err) { 
            console.error(err);
            toast.error('Gagal memuat data'); 
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!window.confirm(`Update status menjadi "${newStatus}"?`)) return;
        try {
            await ordersAPI.updateStatus(id, newStatus);
            toast.success('Status berhasil diupdate');
            loadOrders();
        } catch (err) { toast.error('Gagal update status'); }
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    const filteredOrders = orders.filter(o => {
        const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) || 
                           o.customer_name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <DashboardLayout title="Kelola Pesanan">
            <div className="table-container">
                <div className="table-header" style={{flexWrap: 'wrap', gap: 15}}>
                    <h3 className="table-title">Semua Pesanan</h3>
                    <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                        <div className="search-box">
                            <FaSearch />
                            <input type="text" placeholder="Cari order/pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{width: 'auto', minWidth: 150}}>
                            <option value="">Semua Status</option>
                            <option value="Antrian">Antrian</option>
                            <option value="Proses Cuci">Proses Cuci</option>
                            <option value="Proses Kering">Proses Kering</option>
                            <option value="Setrika">Setrika</option>
                            <option value="Siap Diambil">Siap Diambil</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                    </div>
                </div>
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
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>
                                {search || statusFilter ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
                            </td></tr>
                        ) : filteredOrders.map(o => (
                            <tr key={o.id}>
                                <td><strong>{o.order_number}</strong></td>
                                <td>
                                    <div>{o.customer_name}</div>
                                    <small style={{color: '#999'}}>{o.phone_number}</small>
                                </td>
                                <td>{formatDate(o.entry_date)}</td>
                                <td style={{textAlign: 'right'}}>Rp {formatPrice(o.total_price)}</td>
                                <td style={{textAlign: 'center'}}>
                                    <span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span>
                                </td>
                                <td>
                                    <Link to={`/admin/orders/${o.id}`} className="btn btn-primary btn-sm" style={{display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 15px'}}>
                                        <FaEye /> Detail
                                    </Link>
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