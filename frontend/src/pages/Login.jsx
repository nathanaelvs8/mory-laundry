import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error('Username dan password harus diisi');
            return;
        }
        setLoading(true);
        try {
            const user = await login(formData);
            toast.success(`Selamat datang, ${user.full_name}!`);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login gagal');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Link to="/"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                </div>
                <h1 className="auth-title">Selamat Datang</h1>
                <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><FaUser style={{marginRight: 8}} />Username</label>
                        <input type="text" name="username" className="form-control" placeholder="Masukkan username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaLock style={{marginRight: 8}} />Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Masukkan password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                        <FaSignInAlt /> {loading ? 'Loading...' : 'Masuk'}
                    </button>
                </form>
                <div className="auth-footer">
                    Belum punya akun? <Link to="/signup">Daftar Sekarang</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;