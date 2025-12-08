import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { ordersAPI } from '../../services/api';
import { FaFilter, FaPrint, FaSearch, FaFileExcel, FaRedo } from 'react-icons/fa';

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

    // Filter orders
    const filteredOrders = orders.filter(o => {
        const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) || 
                           o.customer_name?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    // Calculate summary
    const summary = {
        totalTransactions: filteredOrders.length,
        completedTransactions: filteredOrders.filter(o => o.status === 'Selesai').length,
        totalRevenue: filteredOrders.filter(o => o.status === 'Selesai').reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0),
        avgTransaction: filteredOrders.length > 0 ? filteredOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0) / filteredOrders.length : 0
    };

    return (
        <DashboardLayout title="Laporan Transaksi">
            {/* Filter Form */}
            <div className="table-container no-print" style={{padding: 20, marginBottom: 25}}>
                <form onSubmit={handleFilter} style={{display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'end'}}>
                    <div className="form-group" style={{margin: 0, minWidth: 150}}>
                        <label className="form-label">Dari Tanggal</label>
                        <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group" style={{margin: 0, minWidth: 150}}>
                        <label className="form-label">Sampai Tanggal</label>
                        <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-group" style={{margin: 0, minWidth: 150}}>
                        <label className="form-label">Status</label>
                        <select className="form-control" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                    <button type="submit" className="btn btn-primary"><FaFilter /> Filter</button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset}><FaRedo /> Reset</button>
                    <button type="button" className="btn btn-outline" onClick={handlePrint}><FaPrint /> Cetak PDF</button>
                </form>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid print-area">
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
                        <div className="stat-label">Rata-rata Transaksi</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-container print-area">
                <div className="table-header no-print">
                    <h3 className="table-title">Daftar Transaksi</h3>
                    <div className="search-box">
                        <FaSearch />
                        <input type="text" placeholder="Cari order/pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                {/* Print Header */}
                <div className="print-header" style={{display: 'none'}}>
                    <h2 style={{textAlign: 'center', marginBottom: 5}}>LAPORAN TRANSAKSI</h2>
                    <p style={{textAlign: 'center', color: '#666', marginBottom: 20}}>
                        Mory Laundry - {startDate && endDate ? `${formatDate(startDate)} s/d ${formatDate(endDate)}` : 'Semua Periode'}
                    </p>
                </div>

                <table>
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
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>
                                <div className="spinner"></div>
                                <p style={{marginTop: 10}}>Loading...</p>
                            </td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>
                                Tidak ada data transaksi
                            </td></tr>
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
                    {filteredOrders.length > 0 && (
                        <tfoot>
                            <tr style={{background: '#f9f9f9'}}>
                                <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold', padding: 15}}>TOTAL PENDAPATAN (Selesai):</td>
                                <td style={{textAlign: 'right', fontWeight: 'bold', color: 'var(--gold)', fontSize: 16, padding: 15}}>Rp {formatPrice(summary.totalRevenue)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: relative; }
                    .no-print { display: none !important; }
                    .print-header { display: block !important; }
                    .stats-grid { margin-bottom: 20px; }
                    .stat-card { border: 1px solid #ddd; }
                }
                .spinner {
                    width: 40px; height: 40px; margin: 0 auto;
                    border: 4px solid #f3f3f3; border-top: 4px solid var(--gold);
                    border-radius: 50%; animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </DashboardLayout>
    );
};

export default AdminReports;