import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt, FaConciergeBell, FaShoppingCart, FaUsers, FaChartBar, FaPlusCircle, FaHistory, FaUser, FaHome, FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminMenu = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/admin/services', icon: <FaConciergeBell />, label: 'Kelola Layanan' },
        { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Kelola Pesanan' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Kelola User' },
        { path: '/admin/reports', icon: <FaChartBar />, label: 'Laporan' },
    ];

    const customerMenu = [
        { path: '/customer/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/customer/new-order', icon: <FaPlusCircle />, label: 'Buat Pesanan' },
        { path: '/customer/orders', icon: <FaHistory />, label: 'Riwayat Pesanan' },
        { path: '/customer/profile', icon: <FaUser />, label: 'Profil Saya' },
    ];

    const menu = isAdmin ? adminMenu : customerMenu;

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Link to="/"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                </div>
                <ul className="sidebar-menu">
                    {menu.map((item, i) => (
                        <li key={i}>
                            <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                                {item.icon} <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    <li style={{marginTop: 30, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 20}}>
                        <Link to="/"><FaHome /> <span>Kembali ke Beranda</span></Link>
                    </li>
                    <li>
                        <a onClick={handleLogout} style={{cursor: 'pointer', color: '#ff6b6b'}}>
                            <FaSignOutAlt /> <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </aside>
            <div className="main-content">
                <header className="top-bar">
                    <h1 className="page-title">{title}</h1>
                    <div className="user-info">
                        <span style={{fontSize: 14, color: 'var(--gray)'}}>Halo, <strong>{user?.full_name}</strong></span>
                        <div className="user-avatar">{user?.full_name?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>
                <main className="content-area">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
