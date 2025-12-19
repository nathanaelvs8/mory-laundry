import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { ordersAPI } from '../../services/api';
import { FaEye, FaSearch, FaTrash } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [confirmModal, setConfirmModal] = useState({ open: false, orderId: null, orderNumber: '' });

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        try {
            const res = await ordersAPI.getAll();
            setOrders(res.data.data || []);
        } catch (err) { toast.error('Gagal memuat data'); }
        setLoading(false);
    };

    const handleDelete = async () => {
        try {
            await ordersAPI.updateStatus(confirmModal.orderId, 'Dibatalkan');
            toast.success('Pesanan berhasil dibatalkan');
            loadOrders();
        } catch (err) { toast.error('Gagal membatalkan pesanan'); }
    };

    const openDeleteModal = (id, orderNumber) => {
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

    const filteredOrders = orders.filter(o => {
        const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || o.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <DashboardLayout title="Kelola Pesanan">
            <div className="table-container">
                <div className="table-header" style={{flexWrap: 'wrap', gap: 15}}>
                    <h3 className="table-title">Semua Pesanan</h3>
                    <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', flex: '1 1 100%'}}>
                        <div className="search-box" style={{flex: '1 1 200px'}}>
                            <FaSearch />
                            <input type="text" placeholder="Cari order/pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{width: 'auto', minWidth: 130, flex: '0 0 auto'}}>
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
                <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{minWidth: 650}}>
                        <thead>
                            <tr>
                                <th>No. Order</th>
                                <th>Pelanggan</th>
                                <th>Tanggal</th>
                                <th style={{textAlign: 'right'}}>Total</th>
                                <th style={{textAlign: 'center'}}>Status</th>
                                <th>Aksi</th>
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
                                        <div style={{display: 'flex', gap: 8}}>
                                            <Link to={`/admin/orders/${o.id}`} className="btn btn-primary btn-sm" style={{display: 'inline-flex', alignItems: 'center', gap: 5}}>
                                                <FaEye /> Detail
                                            </Link>
                                            {!['Selesai', 'Dibatalkan'].includes(o.status) && (
                                                <button className="btn btn-danger btn-sm" style={{display: 'inline-flex', alignItems: 'center', gap: 5}} onClick={() => openDeleteModal(o.id, o.order_number)}>
                                                    <FaTrash />
                                                </button>
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
                onConfirm={handleDelete}
                title="Batalkan Pesanan?"
                message={`Apakah Anda yakin ingin membatalkan pesanan ${confirmModal.orderNumber}?`}
                type="danger"
            />
        </DashboardLayout>
    );
};

export default AdminOrders;