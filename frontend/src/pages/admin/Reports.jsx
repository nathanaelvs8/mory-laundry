import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { reportsAPI } from '../../services/api.js';
import { FaFilter, FaPrint, FaSearch } from 'react-icons/fa';

const AdminReports = () => {
    const [report, setReport] = useState({ orders: [], summary: { totalTransactions: 0, completedTransactions: 0, totalRevenue: 0, avgTransaction: 0 } });
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => { loadReport(); }, []);

    const loadReport = async () => {
        try {
            const res = await reportsAPI.getTransactions({ start_date: startDate || undefined, end_date: endDate || undefined });
            setReport(res.data.data);
        } catch (err) { toast.error('Gagal memuat laporan'); }
        setLoading(false);
    };

    const handleFilter = (e) => {
        e.preventDefault();
        loadReport();
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
    const getStatusClass = (status) => status === 'Selesai' ? 'selesai' : status === 'Dibatalkan' ? 'batal' : 'proses';
    const filtered = report.orders.filter(o => o.order_number.toLowerCase().includes(search.toLowerCase()) || o.customer_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout title="Laporan Transaksi">
            <form onSubmit={handleFilter} style={{display: 'flex', gap: 15, flexWrap: 'wrap', alignItems: 'end', marginBottom: 25}}>
                <div className="form-group" style={{margin: 0}}>
                    <label className="form-label">Dari Tanggal</label>
                    <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="form-group" style={{margin: 0}}>
                    <label className="form-label">Sampai Tanggal</label>
                    <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary"><FaFilter /> Filter</button>
                <button type="button" className="btn btn-secondary" onClick={() => window.print()}><FaPrint /> Cetak</button>
            </form>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon gold">💰</div>
                    <div><div className="stat-value">Rp {formatPrice(report.summary.totalRevenue)}</div><div className="stat-label">Total Pendapatan</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">📊</div>
                    <div><div className="stat-value">{report.summary.totalTransactions}</div><div className="stat-label">Total Transaksi</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">📈</div>
                    <div><div className="stat-value">Rp {formatPrice(Math.round(report.summary.avgTransaction))}</div><div className="stat-label">Rata-rata Transaksi</div></div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Laporan Transaksi</h3>
                    <div className="search-box">
                        <FaSearch /><input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <table>
                    <thead><tr><th>No</th><th>No. Order</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>Tidak ada data</td></tr>
                        ) : filtered.map((o, i) => (
                            <tr key={o.id}>
                                <td>{i + 1}</td>
                                <td><strong>{o.order_number}</strong></td>
                                <td>{o.customer_name}</td>
                                <td>{formatDate(o.entry_date)}</td>
                                <td>Rp {formatPrice(o.total_price)}</td>
                                <td><span className={`status-badge ${getStatusClass(o.status)}`}>{o.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                    {filtered.length > 0 && (
                        <tfoot>
                            <tr>
                                <td colSpan="4" style={{textAlign: 'right', fontWeight: 'bold'}}>TOTAL PENDAPATAN:</td>
                                <td colSpan="2" style={{fontWeight: 'bold', color: 'var(--gold)'}}>Rp {formatPrice(report.summary.totalRevenue)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </DashboardLayout>
    );
};

export default AdminReports;
