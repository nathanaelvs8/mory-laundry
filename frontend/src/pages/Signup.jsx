import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaUser, FaLock, FaPhone } from 'react-icons/fa';

const Signup = () => {
    const [formData, setFormData] = useState({
        full_name: '', username: '', phone_number: '', password: '', confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { full_name, username, password, confirm_password } = formData;
        
        if (!full_name || !username || !password || !confirm_password) {
            toast.error('Semua field wajib diisi'); return;
        }
        if (password.length < 6) {
            toast.error('Password minimal 6 karakter'); return;
        }
        if (password !== confirm_password) {
            toast.error('Password tidak cocok'); return;
        }

        setLoading(true);
        try {
            await signup(formData);
            toast.success('Registrasi berhasil! Silakan login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registrasi gagal');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Link to="/"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                </div>
                <h1 className="auth-title">Daftar Akun</h1>
                <p className="auth-subtitle">Buat akun untuk menikmati layanan kami</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><FaUser style={{marginRight: 8}} />Nama Lengkap</label>
                        <input type="text" name="full_name" className="form-control" placeholder="Masukkan nama lengkap" value={formData.full_name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaUser style={{marginRight: 8}} />Username</label>
                        <input type="text" name="username" className="form-control" placeholder="Masukkan username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaPhone style={{marginRight: 8}} />Nomor HP</label>
                        <input type="tel" name="phone_number" className="form-control" placeholder="Contoh: 081234567890" value={formData.phone_number} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaLock style={{marginRight: 8}} />Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Minimal 6 karakter" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaLock style={{marginRight: 8}} />Konfirmasi Password</label>
                        <input type="password" name="confirm_password" className="form-control" placeholder="Ulangi password" value={formData.confirm_password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                        <FaUserPlus /> {loading ? 'Loading...' : 'Daftar Sekarang'}
                    </button>
                </form>
                <div className="auth-footer">
                    Sudah punya akun? <Link to="/login">Masuk Disini</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
