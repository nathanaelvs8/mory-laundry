import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPhone, FaIdCard } from 'react-icons/fa';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        phone_number: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.full_name || !formData.username || !formData.password) {
            toast.error('Semua field wajib diisi');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password tidak cocok');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register({
                full_name: formData.full_name,
                username: formData.username,
                phone_number: formData.phone_number,
                password: formData.password
            });
            toast.success('Registrasi berhasil! Silakan login');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registrasi gagal');
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

                    <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Buat Akun Baru</h2>
                    <p style={{ textAlign: 'center', color: '#666', marginBottom: 30 }}>Daftar untuk mulai menggunakan layanan kami</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nama Lengkap</label>
                            <div style={{ position: 'relative' }}>
                                <FaIdCard style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="text"
                                    name="full_name"
                                    className="form-control"
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    style={{ paddingLeft: 45 }}
                                />
                            </div>
                        </div>

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
                            <label className="form-label">No. HP (Opsional)</label>
                            <div style={{ position: 'relative' }}>
                                <FaPhone style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    className="form-control"
                                    placeholder="Contoh: 08123456789"
                                    value={formData.phone_number}
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
                                    placeholder="Minimal 6 karakter"
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

                        <div className="form-group">
                            <label className="form-label">Konfirmasi Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Ulangi password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ paddingLeft: 45 }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: 10 }}>
                            {loading ? 'Memproses...' : 'Daftar'}
                        </button>
                    </form>

                    {/* Footer - Centered with different color link */}
                    <div className="auth-footer" style={{ textAlign: 'center', marginTop: 25, paddingTop: 20, borderTop: '1px solid #eee' }}>
                        <span style={{ color: '#666' }}>Sudah punya akun? </span>
                        <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
                            Masuk Disini
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

export default Signup;