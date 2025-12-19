import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { servicesAPI } from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: null, service_name: '', unit: '', price: '', description: '', is_active: 1 });
    const [confirmModal, setConfirmModal] = useState({ open: false, type: '', serviceId: null });

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        try { const res = await servicesAPI.getAllAdmin(); setServices(res.data.data || []); }
        catch (err) { toast.error('Gagal memuat data'); }
        setLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const openAddModal = () => {
        setFormData({ id: null, service_name: '', unit: '', price: '', description: '', is_active: 1 });
        setEditMode(false);
        setShowModal(true);
    };

    const openEditModal = (service) => {
        setFormData({ ...service, price: service.price.toString() });
        setEditMode(true);
        setShowModal(true);
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (!formData.service_name || !formData.unit || !formData.price) { toast.error('Semua field wajib diisi'); return; }
        setConfirmModal({ open: true, type: editMode ? 'update' : 'create', serviceId: formData.id });
    };

    const handleConfirmSubmit = async () => {
        try {
            if (confirmModal.type === 'update') {
                await servicesAPI.update(formData.id, formData);
                toast.success('Layanan berhasil diupdate');
            } else {
                await servicesAPI.create(formData);
                toast.success('Layanan berhasil ditambahkan');
            }
            setShowModal(false);
            loadServices();
        } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan'); }
    };

    const handleDeleteClick = (id) => {
        setConfirmModal({ open: true, type: 'delete', serviceId: id });
    };

    const handleConfirmDelete = async () => {
        try {
            await servicesAPI.delete(confirmModal.serviceId);
            toast.success('Layanan berhasil dihapus');
            loadServices();
        } catch (err) { toast.error('Gagal menghapus'); }
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const filtered = services.filter(s => s.service_name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout title="Kelola Layanan">
            <div className="table-container">
                <div className="table-header">
                    <h3 className="table-title">Daftar Layanan</h3>
                    <div className="table-actions" style={{display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%', marginTop: 10}}>
                        <div className="search-box" style={{flex: '1 1 200px'}}><FaSearch /><input type="text" placeholder="Cari layanan..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                        <button className="btn btn-primary btn-sm" onClick={openAddModal}><FaPlus /> Tambah</button>
                    </div>
                </div>

                {/* Desktop Table */}
                <table>
                    <thead><tr><th>No</th><th>Nama Layanan</th><th>Satuan</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                        {loading ? <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>Loading...</td></tr>
                        : filtered.length === 0 ? <tr><td colSpan="6" style={{textAlign: 'center', padding: 40, color: '#999'}}>Tidak ada data</td></tr>
                        : filtered.map((s, i) => (
                            <tr key={s.id}>
                                <td>{i + 1}</td>
                                <td><strong>{s.service_name}</strong></td>
                                <td>{s.unit}</td>
                                <td>Rp {formatPrice(s.price)}</td>
                                <td><span className={`status-badge ${s.is_active ? 'selesai' : 'batal'}`}>{s.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
                                <td>
                                    <button className="action-btn edit" onClick={() => openEditModal(s)}><FaEdit /></button>
                                    <button className="action-btn delete" onClick={() => handleDeleteClick(s.id)}><FaTrash /></button>
                                </td>
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
                    ) : filtered.map((s, i) => (
                        <div key={s.id} className="mobile-card-item">
                            <div className="mobile-card-header">
                                <span className="mobile-card-title">{s.service_name}</span>
                                <span className={`status-badge ${s.is_active ? 'selesai' : 'batal'}`}>{s.is_active ? 'Aktif' : 'Nonaktif'}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Satuan</span>
                                <span className="mobile-card-value">{s.unit}</span>
                            </div>
                            <div className="mobile-card-row">
                                <span className="mobile-card-label">Harga</span>
                                <span className="mobile-card-value" style={{fontWeight: 600, color: 'var(--gold)'}}>Rp {formatPrice(s.price)}</span>
                            </div>
                            {s.description && (
                                <div className="mobile-card-row">
                                    <span className="mobile-card-label">Deskripsi</span>
                                    <span className="mobile-card-value">{s.description}</span>
                                </div>
                            )}
                            <div className="mobile-card-actions">
                                <button className="btn btn-outline btn-sm" onClick={() => openEditModal(s)}><FaEdit /> Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(s.id)}><FaTrash /> Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Modal */}
            <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={() => setShowModal(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">{editMode ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
                        <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                    </div>
                    <form onSubmit={handleSubmitClick}>
                        <div className="form-group">
                            <label className="form-label">Nama Layanan</label>
                            <input type="text" name="service_name" className="form-control" value={formData.service_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Satuan</label>
                            <select name="unit" className="form-control" value={formData.unit} onChange={handleChange} required>
                                <option value="">Pilih satuan</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="pasang">Pasang</option>
                                <option value="m²">Meter Persegi (m²)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Harga (Rp)</label>
                            <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deskripsi</label>
                            <textarea name="description" className="form-control" value={formData.description || ''} onChange={handleChange} rows="3"></textarea>
                        </div>
                        {editMode && (
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select name="is_active" className="form-control" value={formData.is_active} onChange={handleChange}>
                                    <option value={1}>Aktif</option>
                                    <option value={0}>Nonaktif</option>
                                </select>
                            </div>
                        )}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                            <button type="submit" className="btn btn-primary">{editMode ? 'Update' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.open}
                onClose={() => setConfirmModal({ open: false, type: '', serviceId: null })}
                onConfirm={confirmModal.type === 'delete' ? handleConfirmDelete : handleConfirmSubmit}
                title={confirmModal.type === 'delete' ? 'Hapus Layanan?' : confirmModal.type === 'update' ? 'Update Layanan?' : 'Tambah Layanan?'}
                message={confirmModal.type === 'delete' ? 'Apakah Anda yakin ingin menghapus layanan ini?' : 'Simpan perubahan?'}
                type={confirmModal.type === 'delete' ? 'danger' : 'warning'}
            />
        </DashboardLayout>
    );
};

export default AdminServices;