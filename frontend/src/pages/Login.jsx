import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaSignInAlt, FaUser, FaLock, FaExclamationCircle } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); // Clear error saat user mulai ketik
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError('Username dan password harus diisi');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const user = await login(formData);
            toast.success(`Selamat datang, ${user.full_name}!`);
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard');
        } catch (err) {
            console.log('Login error:', err);
            const errorMsg = err.response?.data?.message || 'Login gagal. Periksa username dan password Anda.';
            setError(errorMsg);
            setLoading(false);
            // Focus ke password field
            const pwField = formRef.current?.querySelector('input[name="password"]');
            if (pwField) pwField.focus();
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <Link to="/"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                </div>
                <h1 className="auth-title">Selamat Datang</h1>
                <p className="auth-subtitle">Masuk ke akun Anda untuk melanjutkan</p>
                
                {/* Error Message */}
                {error && (
                    <div style={{
                        background: '#fff2f2',
                        border: '1px solid #ffccc7',
                        borderRadius: 8,
                        padding: '12px 15px',
                        marginBottom: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#cf1322',
                        animation: 'shake 0.5s ease-in-out'
                    }}>
                        <FaExclamationCircle style={{flexShrink: 0}} />
                        <span>{error}</span>
                    </div>
                )}
                
                <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><FaUser style={{marginRight: 8}} />Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control" 
                            placeholder="Masukkan username" 
                            value={formData.username} 
                            onChange={handleChange}
                            autoComplete="username"
                            style={error ? {borderColor: '#ff7875'} : {}}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FaLock style={{marginRight: 8}} />Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Masukkan password" 
                            value={formData.password} 
                            onChange={handleChange}
                            autoComplete="current-password"
                            style={error ? {borderColor: '#ff7875'} : {}}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
                        <FaSignInAlt /> {loading ? 'Loading...' : 'Masuk'}
                    </button>
                </form>
                <div className="auth-footer">
                    Belum punya akun? <Link to="/signup">Daftar Sekarang</Link>
                </div>
            </div>
            
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-5px); }
                    40%, 80% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default Login;