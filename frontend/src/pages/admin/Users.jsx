import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { usersAPI } from '../../services/api';
import { FaSearch, FaTrash } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmModal, setConfirmModal] = useState({ open: false, userId: null, userName: '' });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try { const res = await usersAPI.getAll(); setUsers(res.data.data || []); }
        catch (err) { toast.error('Gagal memuat data'); }
        setLoading(false);
    };

    const handleDeleteClick = (id, name, role) => {
        if (role === 'admin') { toast.error('Tidak dapat menghapus admin'); return; }
        setConfirmModal({ open: true, userId: id, userName: name });
    };

    const handleConfirmDelete = async () => {
        try {
            await usersAPI.delete(confirmModal.userId);
            toast.success('User berhasil dihapus');
            loadUsers();
        } catch (err) { toast.error('Gagal menghapus'); }
    };

    const formatDate = (date) => new Date(date).toLocaleDateString('id-ID');
    const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout title="Kelola User">
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Daftar Pengguna</h3>
                    <div className="search-box" style={{width: '100%', maxWidth: 300, marginTop: 10}}><FaSearch /><input type="text" placeholder="Cari user..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                </div>

                {/* Desktop Table */}
                <table>
                    <thead><tr><th>No</th><th>Nama Lengkap</th><th>Username</th><th>No. HP</th><th>Role</th><th>Tgl Daftar</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
                            : filtered.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#999' }}>Tidak ada data</td></tr>
                                : filtered.map((u, i) => (
                                    <tr key={u.id}>
                                        <td>{i + 1}</td>
                                        <td><strong>{u.full_name}</strong></td>
                                        <td>{u.username}</td>
                                        <td>{u.phone_number || '-'}</td>
                                        <td><span className={`status-badge ${u.role === 'admin' ? 'selesai' : 'antrian'}`}>{u.role}</span></td>
                                        <td>{formatDate(u.created_at)}</td>
                                        <td>{u.role !== 'admin' && <button className="action-btn delete" onClick={() => handleDeleteClick(u.id, u.full_name, u.role)}><FaTrash /></button>}</td>
                                    </tr>
                                ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="mobile-card" style={{padding: 15}}>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: 40}}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{textAlign: 'center', padding: 40, color: '#999'}}>Tidak ada data</div>
                    ) : filtered.map((u, i) => (
                        <div key={u.id} className="mobile-card-item">
                            <div className="mobile-card-header">
                                <span className="mobile-card-title">{u.full_name}</span>
                                <span className={`status-badge ${u.role === 'admin' ? 'selesai' : 'antrian'}`}>{u.role}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Username</span>
                                <span className="mobile-card-value">@{u.username}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">No. HP</span>
                                <span className="mobile-card-value">{u.phone_number || '-'}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Tgl Daftar</span>
                                <span className="mobile-card-value">{formatDate(u.created_at)}</span>
                            </div>
                            {u.role !== 'admin' && (
                                <div className="mobile-card-actions">
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(u.id, u.full_name, u.role)}><FaTrash /> Hapus</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, userId: null, userName: '' })}
                onConfirm={handleConfirmDelete}
                title="Hapus User?"
                message={`Apakah Anda yakin ingin menghapus user "${confirmModal.userName}"?`}
                type="danger"
            />
        </DashboardLayout>
    );
};

export default AdminUsers;