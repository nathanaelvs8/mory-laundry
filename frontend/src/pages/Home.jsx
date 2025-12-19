import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaWhatsapp, FaStar, FaClock, FaShieldAlt, FaTruck } from 'react-icons/fa';

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="home-page">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <img src="/images/logo.png" alt="Mory Laundry" />
                    </Link>
                    
                    <div className="navbar-auth">
                        <Link to="/login" className="btn btn-outline btn-sm">Masuk</Link>
                        <Link to="/signup" className="btn btn-primary btn-sm">Daftar</Link>
                        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="mobile-menu">
                        <Link to="/login" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Masuk</Link>
                        <Link to="/signup" className="mobile-menu-item" onClick={() => setMenuOpen(false)}>Daftar</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Laundry Bersih & Wangi <span style={{color: 'var(--gold)'}}>Tanpa Repot</span></h1>
                        <p className="hero-subtitle">Layanan laundry profesional dengan hasil terbaik. Antar jemput gratis, harga terjangkau!</p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="btn btn-primary btn-lg">Mulai Sekarang</Link>
                            <a href="https://wa.me/6281217607101" target="_blank" rel="noreferrer" className="btn btn-outline btn-lg" style={{borderColor: '#25D366', color: '#25D366'}}>
                                <FaWhatsapp /> WhatsApp
                            </a>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat"><strong>500+</strong><span>Pelanggan Puas</span></div>
                            <div className="hero-stat"><strong>5000+</strong><span>Pesanan Selesai</span></div>
                            <div className="hero-stat"><strong>4.9</strong><span>Rating</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section" style={{background: '#f9f9f9'}}>
                <div className="container">
                    <h2 className="section-title">Layanan Kami</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">👕</div>
                            <h3>Cuci Reguler</h3>
                            <p>Cuci, kering, lipat rapi. Cocok untuk pakaian sehari-hari.</p>
                            <span className="service-price">Rp 7.000/kg</span>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">👔</div>
                            <h3>Cuci Setrika</h3>
                            <p>Cuci bersih plus setrika rapi. Siap pakai!</p>
                            <span className="service-price">Rp 10.000/kg</span>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🧥</div>
                            <h3>Dry Clean</h3>
                            <p>Untuk pakaian khusus seperti jas, gaun, dan jaket.</p>
                            <span className="service-price">Rp 25.000/pcs</span>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🛏️</div>
                            <h3>Cuci Bed Cover</h3>
                            <p>Sprei, selimut, dan bed cover jadi bersih wangi.</p>
                            <span className="service-price">Rp 20.000/pcs</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Kenapa Pilih Mory Laundry?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <FaStar className="feature-icon" style={{color: 'var(--gold)'}} />
                            <h4>Kualitas Terbaik</h4>
                            <p>Deterjen premium & pewangi berkualitas</p>
                        </div>
                        <div className="feature-item">
                            <FaClock className="feature-icon" style={{color: 'var(--gold)'}} />
                            <h4>Cepat & Tepat Waktu</h4>
                            <p>Selesai dalam 2-3 hari kerja</p>
                        </div>
                        <div className="feature-item">
                            <FaShieldAlt className="feature-icon" style={{color: 'var(--gold)'}} />
                            <h4>Aman & Terpercaya</h4>
                            <p>Garansi cucian hilang/rusak</p>
                        </div>
                        <div className="feature-item">
                            <FaTruck className="feature-icon" style={{color: 'var(--gold)'}} />
                            <h4>Antar Jemput Gratis</h4>
                            <p>Free pickup & delivery area tertentu</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section" style={{background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: '#fff'}}>
                <div className="container" style={{textAlign: 'center'}}>
                    <h2 style={{marginBottom: 15}}>Siap Mencoba Layanan Kami?</h2>
                    <p style={{marginBottom: 25, opacity: .9}}>Daftar sekarang dan nikmati kemudahan laundry online!</p>
                    <Link to="/signup" className="btn btn-lg" style={{background: '#fff', color: 'var(--gold)'}}>Daftar Gratis</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <img src="/images/logo.png" alt="Mory Laundry" style={{height: 50, marginBottom: 15}} />
                            <p>Solusi laundry terpercaya untuk kebutuhan Anda.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Kontak</h4>
                            <p>📍 Jl. MT Haryono No. 4C, Sukasari, Tangerang</p>
                            <p>📞 +62 812-1760-7101</p>
                            <p>⏰ Senin - Sabtu: 08:00 - 20:00</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Mory Laundry. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style>{`
                .mobile-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #fff;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    padding: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .mobile-menu-item {
                    padding: 12px 20px;
                    text-decoration: none;
                    color: var(--dark);
                    font-weight: 500;
                    border-radius: 8px;
                    text-align: center;
                    background: #f5f5f5;
                }
                .mobile-menu-item:hover {
                    background: var(--gold);
                    color: #fff;
                }
                .navbar-toggle {
                    display: none;
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: var(--dark);
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .navbar-toggle { display: block; }
                    .navbar { position: relative; }
                }
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 30px;
                    margin-top: 40px;
                }
                .feature-item {
                    text-align: center;
                    padding: 20px;
                }
                .feature-icon {
                    font-size: 40px;
                    margin-bottom: 15px;
                }
                .feature-item h4 {
                    margin-bottom: 10px;
                }
                .feature-item p {
                    color: #666;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

export default Home;