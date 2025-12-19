import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api';
import { FaFilter, FaPrint, FaSearch, FaRedo } from 'react-icons/fa';

const AdminReports = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { loadReport(); }, []);

    const loadReport = async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (statusFilter) params.status = statusFilter;
            
            const res = await ordersAPI.getAll(params);
            setOrders(res.data.data || []);
        } catch (err) { 
            console.error(err);
            toast.error('Gagal memuat laporan'); 
        }
        setLoading(false);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        loadReport();
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setStatusFilter('');
        setSearch('');
        loadReport();
    };

    const handlePrint = () => {
        window.print();
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const getStatusClass = (status) => {
        if (status === 'Selesai') return 'selesai';
        if (status === 'Dibatalkan') return 'batal';
        if (status === 'Antrian') return 'antrian';
        return 'proses';
    };

    const filteredOrders = orders.filter(o => {
        const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) || 
                           o.customer_name?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const summary = {
        totalTransactions: filteredOrders.length,
        completedTransactions: filteredOrders.filter(o => o.status === 'Selesai').length,
        totalRevenue: filteredOrders.filter(o => o.status === 'Selesai').reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0),
        avgTransaction: filteredOrders.length > 0 ? filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0) / filteredOrders.length : 0
    };

    return (
        <DashboardLayout title="Laporan Transaksi">
            {/* Summary Cards */}
            <div className="stats-grid print-area" style={{marginBottom: 20}}>
                <div className="stat-card">
                    <div className="stat-icon gold">📊</div>
                    <div>
                        <div className="stat-value">{summary.totalTransactions}</div>
                        <div className="stat-label">Total Transaksi</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div>
                        <div className="stat-value">{summary.completedTransactions}</div>
                        <div className="stat-label">Transaksi Selesai</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">💰</div>
                    <div>
                        <div className="stat-value">Rp {formatPrice(summary.totalRevenue)}</div>
                        <div className="stat-label">Total Pendapatan</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">📈</div>
                    <div>
                        <div className="stat-value">Rp {formatPrice(Math.round(summary.avgTransaction))}</div>
                        <div className="stat-label">Rata-rata</div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="table-container no-print" style={{padding: 20, marginBottom: 20}}>
                <form onSubmit={handleFilter} style={{display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end'}}>
                    <div className="form-group" style={{margin: 0, flex: '1 1 130px'}}>
                        <label className="form-label" style={{fontSize: 12}}>Dari Tanggal</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group" style={{margin: 0, flex: '1 1 130px'}}>
                        <label className="form-label" style={{fontSize: 12}}>Sampai Tanggal</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-group" style={{margin: 0, flex: '1 1 130px'}}>
                        <label className="form-label" style={{fontSize: 12}}>Status</label>
                        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Semua</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                    </div>
                    <div style={{display: 'flex', gap: 8, flex: '1 1 100%'}}>
                        <button type="submit" className="btn btn-primary btn-sm"><FaFilter /> Filter</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}><FaRedo /></button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}><FaPrint /></button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="table-container print-area">
                <div className="table-header no-print">
                    <h3 className="table-title">Daftar Transaksi</h3>
                    <div className="search-box" style={{marginTop: 10}}>
                        <FaSearch />
                        <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div style={{overflowX: 'auto', WebkitOverflowScrolling: 'touch'}}>
                    <table style={{minWidth: 550}}>
                        <thead>
                            <tr>
                                <th style={{width: 50}}>No</th>
                                <th>No. Order</th>
                                <th>Pelanggan</th>
                                <th>Tanggal</th>
                                <th style={{textAlign: 'right'}}>Total</th>
                                <th style={{textAlign: 'center'}}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>Tidak ada data</td></tr>
                            ) : filteredOrders.map((o, i) => (
                                <tr key={o.id}>
                                    <td>{i + 1}</td>
                                    <td><strong>{o.order_number}</strong></td>
                                    <td>{o.customer_name}</td>
                                    <td>{formatDate(o.entry_date)}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(o.total_price)}</td>
                                    <td style={{textAlign: 'center'}}><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Footer - TIDAK ikut scroll */}
                {filteredOrders.length > 0 && (
                    <div style={{padding: 15, background: '#f9f9f9', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
                        <span style={{fontWeight: 600}}>Total Pendapatan (Selesai):</span>
                        <span style={{fontWeight: 700, fontSize: 18, color: 'var(--gold)'}}>Rp {formatPrice(summary.totalRevenue)}</span>
                    </div>
                )}
            </div>

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .no-print { display: none !important; }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default AdminReports;