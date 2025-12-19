import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error('Username dan password wajib diisi');
            return;
        }
        setLoading(true);
        try {
            const result = await login(formData.username, formData.password);
            if (result.success) {
                toast.success('Login berhasil!');
                navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
            } else {
                toast.error(result.message || 'Login gagal');
            }
        } catch (err) {
            toast.error('Terjadi kesalahan');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo - Centered & Large */}
                    <div className="auth-logo" style={{ textAlign: 'center', marginBottom: 30 }}>
                        <img src="/images/logo.png" alt="Mory Laundry" style={{ height: 100 }} />
                    </div>

                    <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Selamat Datang!</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>Masuk ke akun Anda</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    placeholder="Masukkan username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    style={{ paddingLeft: 45 }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="form-control"
                                    placeholder="Masukkan password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ paddingLeft: 45, paddingRight: 45 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 10 }}>
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    {/* Footer - Centered with different color link */}
                    <div className="auth-footer" style={{ textAlign: 'center', marginTop: 25, paddingTop: 20, borderTop: '1px solid #eee' }}>
                        <span style={{ color: '#666' }}>Belum punya akun? </span>
                        <Link to="/signup" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                            Daftar Sekarang
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .auth-container {
                    width: 100%;
                    max-width: 420px;
                }
                .auth-card {
                    background: #fff;
                    border-radius: 16px;
                    padding: 40px 30px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }
                @media (max-width: 480px) {
                    .auth-card {
                        padding: 30px 20px;
                    }
                    .auth-logo img {
                        height: 80px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;