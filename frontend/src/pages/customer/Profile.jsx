import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { FaSave, FaUser, FaLock } from 'react-icons/fa';

const CustomerProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        new_password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password && formData.new_password.length < 6) {
            toast.error('Password minimal 6 karakter'); return;
        }
        if (formData.new_password && formData.new_password !== formData.confirm_password) {
            toast.error('Konfirmasi password tidak cocok'); return;
        }

        setLoading(true);
        try {
            const res = await authAPI.updateProfile({
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                new_password: formData.new_password || undefined
            });
            updateUser(res.data.data);
            toast.success('Profil berhasil diupdate');
            setFormData({ ...formData, new_password: '', confirm_password: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update profil');
        }
        setLoading(false);
    };

    return (
        <DashboardLayout title="Profil Saya">
            <div style={{maxWidth: 800, margin: '0 auto'}}>
                <div className="table-container" style={{padding: 0, overflow: 'hidden'}}>
                    {/* Header Profil */}
                    <div style={{background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', padding: '30px', color: '#fff', textAlign: 'center'}}>
                        <div style={{width: 80, height: 80, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: 36}}>
                            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <h2 style={{margin: '0 0 5px', fontSize: 24}}>{user?.full_name}</h2>
                        <p style={{margin: 0, opacity: 0.9}}>@{user?.username}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{padding: 30}}>
                        {/* Info Dasar */}
                        <div style={{marginBottom: 30}}>
                            <h4 style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eee'}}>
                                <FaUser style={{color: 'var(--gold)'}} /> Informasi Dasar
                            </h4>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20}}>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Nama Lengkap</label>
                                    <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" value={user?.username} disabled style={{background: '#f5f5f5', cursor: 'not-allowed'}} />
                                    <small style={{color: '#999', fontSize: 12}}>Username tidak dapat diubah</small>
                                </div>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Nomor HP</label>
                                    <input type="tel" name="phone_number" className="form-control" value={formData.phone_number} onChange={handleChange} placeholder="Contoh: 081234567890" />
                                </div>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Role</label>
                                    <input type="text" className="form-control" value={user?.role === 'admin' ? 'Administrator' : 'Pelanggan'} disabled style={{background: '#f5f5f5', cursor: 'not-allowed'}} />
                                </div>
                            </div>
                        </div>

                        {/* Ubah Password */}
                        <div style={{marginBottom: 25}}>
                            <h4 style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eee'}}>
                                <FaLock style={{color: 'var(--gold)'}} /> Ubah Password
                            </h4>
                            <p style={{color: '#666', fontSize: 14, marginBottom: 20, background: '#f9f9f9', padding: 12, borderRadius: 8}}>
                                💡 Kosongkan jika tidak ingin mengubah password
                            </p>
                            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20}}>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Password Baru</label>
                                    <input type="password" name="new_password" className="form-control" value={formData.new_password} onChange={handleChange} placeholder="Minimal 6 karakter" />
                                </div>
                                <div className="form-group" style={{margin: 0}}>
                                    <label className="form-label">Konfirmasi Password Baru</label>
                                    <input type="password" name="confirm_password" className="form-control" value={formData.confirm_password} onChange={handleChange} placeholder="Ulangi password baru" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: 16}} disabled={loading}>
                            <FaSave style={{marginRight: 8}} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProfile;