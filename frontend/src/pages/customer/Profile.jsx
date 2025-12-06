import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authAPI } from '../../services/api.js';
import { FaSave } from 'react-icons/fa';

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
            <div className="table-container" style={{padding: 30, maxWidth: 600}}>
                <h3 style={{marginBottom: 25}}>Profil Saya</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={user?.username} disabled style={{background: '#f5f5f5'}} />
                        <small style={{color: '#999'}}>Username tidak dapat diubah</small>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Nomor HP</label>
                        <input type="tel" name="phone_number" className="form-control" value={formData.phone_number} onChange={handleChange} placeholder="Contoh: 081234567890" />
                    </div>

                    <hr style={{margin: '30px 0', border: 'none', borderTop: '1px solid #eee'}} />

                    <h4 style={{marginBottom: 20}}>Ubah Password</h4>
                    <p style={{color: '#666', fontSize: 14, marginBottom: 20}}>Kosongkan jika tidak ingin mengubah password</p>

                    <div className="form-group">
                        <label className="form-label">Password Baru</label>
                        <input type="password" name="new_password" className="form-control" value={formData.new_password} onChange={handleChange} placeholder="Minimal 6 karakter" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Konfirmasi Password Baru</label>
                        <input type="password" name="confirm_password" className="form-control" value={formData.confirm_password} onChange={handleChange} placeholder="Ulangi password baru" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{marginTop: 10}} disabled={loading}>
                        <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CustomerProfile;
