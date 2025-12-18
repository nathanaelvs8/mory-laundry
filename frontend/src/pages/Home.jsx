import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI } from '../services/api';
import { FaCrown, FaWhatsapp, FaMapMarkerAlt, FaClock, FaMedal, FaBolt, FaTags, FaHeadset, FaFacebook, FaInstagram, FaCheckCircle, FaBars, FaTimes } from 'react-icons/fa';

const Home = () => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const [services, setServices] = useState([]);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        loadServices();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadServices = async () => {
        try {
            const res = await servicesAPI.getAll();
            setServices(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const handleScroll = () => setScrolled(window.scrollY > 50);
    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

    // Smooth scroll to section
    const scrollToSection = (e, sectionId) => {
        e.preventDefault();
        setMenuOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const serviceImages = {
        'Cuci Kering Setrika': '/images/cuci-setrika.jpg',
        'Cuci Kering Lipat': '/images/cuci-standard.jpg',
        'Cuci Kering Saja': '/images/cuci-standard.jpg',
        'Cuci Saja': '/images/cuci-standard.jpg',
        'Setrika': '/images/cuci-setrika.jpg',
        'Sepatu': '/images/sepatu.jpg',
        'Bedcover Besar': '/images/bedcover.png',
        'Bedcover Kecil': '/images/bedcover.png',
        'Boneka Besar': '/images/boneka.jpg',
        'Boneka Kecil': '/images/boneka.jpg',
        'Karpet': '/images/karpet.jpg'
    };

    const getServiceImage = (name) => serviceImages[name] || '/images/cuci-standard.jpg';

    return (
        <>
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                    <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                        <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Beranda</a></li>
                        <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Layanan</a></li>
                        <li><a href="#why-us" onClick={(e) => scrollToSection(e, 'why-us')}>Keunggulan</a></li>
                        <li><a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Kontak</a></li>
                    </ul>
                    <div className="navbar-auth">
                        {isAuthenticated ? (
                            <Link to={isAdmin ? "/admin/dashboard" : "/customer/dashboard"} className="btn btn-primary">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">Masuk</Link>
                                <Link to="/signup" className="btn btn-primary">Daftar</Link>
                            </>
                        )}
                        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero" id="home">
                <div className="hero-container">
                    <div className="hero-content">
                        <span className="hero-badge"><FaCrown /> Premium Laundry Service</span>
                        <h1 className="hero-title">Pakaian Bersih,<br/><span className="highlight">Hidup Nyaman</span></h1>
                        <p className="hero-desc">Percayakan cucian Anda kepada Mory Laundry. Dengan peralatan modern dan tenaga profesional, kami menjamin hasil cucian yang bersih, wangi, dan rapi.</p>
                        <div className="hero-buttons">
                            <a href="https://wa.me/6281217607101?text=Halo%20Mory%20Laundry" className="btn btn-primary" target="_blank" rel="noreferrer"><FaWhatsapp /> Order WhatsApp</a>
                            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="btn btn-outline">Lihat Layanan</a>
                        </div>
                        <div className="hero-stats">
                            <div><span className="hero-stat-num">500+</span><span className="hero-stat-label">Pelanggan Puas</span></div>
                            <div><span className="hero-stat-num">5+</span><span className="hero-stat-label">Tahun Pengalaman</span></div>
                            <div><span className="hero-stat-num">10K+</span><span className="hero-stat-label">Order Selesai</span></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section" id="services" style={{background: 'var(--light)'}}>
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Layanan & Harga</span>
                        <h2 className="section-title">Pilihan Layanan Laundry Lengkap</h2>
                        <p className="section-desc">Harga transparan dan terjangkau untuk semua kebutuhan laundry Anda</p>
                    </div>
                    <div className="services-grid">
                        {services.length > 0 ? services.map((s, i) => (
                            <div className="service-card" key={s.id || i}>
                                <div className="service-img"><img src={getServiceImage(s.service_name)} alt={s.service_name} /></div>
                                <div className="service-body">
                                    <h3 className="service-name">{s.service_name}</h3>
                                    <p className="service-text">{s.description || 'Layanan laundry berkualitas'}</p>
                                    <div className="service-footer">
                                        <div>
                                            <span className="service-price">Rp {formatPrice(s.price)}</span>
                                            <span className="service-unit">/ {s.unit}</span>
                                        </div>
                                        <a href={`https://wa.me/6281217607101?text=Halo,%20saya%20mau%20order%20${encodeURIComponent(s.service_name)}`} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">Order</a>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#999'}}>Loading layanan...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Why Us */}
            <section className="section" id="why-us" style={{background: '#fff'}}>
                <div className="section-container">
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center'}}>
                        <div style={{position: 'relative'}}>
                            <div style={{borderRadius: 20, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)'}}>
                                <img src="/images/staff.jpg" alt="Staff Mory Laundry" style={{width: '100%', height: 450, objectFit: 'cover', display: 'block'}} />
                                <div style={{position: 'absolute', bottom: 20, left: 20, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: '#fff', padding: '15px 25px', borderRadius: 12, fontWeight: 600, boxShadow: '0 10px 30px rgba(201,162,39,0.4)'}}>
                                    <div style={{fontSize: 24, fontWeight: 700}}>5+ Tahun</div>
                                    <div style={{fontSize: 14, opacity: 0.9}}>Pengalaman Melayani</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="section-badge" style={{marginBottom: 15, display: 'inline-block'}}>Mengapa Pilih Kami</span>
                            <h2 style={{fontSize: 36, fontWeight: 700, marginBottom: 20, color: 'var(--dark)'}}>Layanan Laundry Terpercaya</h2>
                            <p style={{color: 'var(--gray)', marginBottom: 30, lineHeight: 1.8}}>Kami berkomitmen memberikan layanan laundry terbaik dengan hasil yang memuaskan.</p>
                            <div style={{display: 'grid', gap: 20}}>
                                {[
                                    { icon: <FaMedal />, title: 'Kualitas Terjamin', desc: 'Hasil cucian bersih, wangi, dan rapi' },
                                    { icon: <FaBolt />, title: 'Proses Cepat', desc: 'Layanan express 1 hari selesai' },
                                    { icon: <FaTags />, title: 'Harga Terjangkau', desc: 'Harga bersaing dengan kualitas premium' },
                                    { icon: <FaHeadset />, title: 'Layanan 24/7', desc: 'Customer service siap membantu' },
                                ].map((item, i) => (
                                    <div key={i} style={{display: 'flex', gap: 15, padding: 20, background: 'var(--light)', borderRadius: 12}}>
                                        <div style={{width: 50, height: 50, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, flexShrink: 0}}>{item.icon}</div>
                                        <div><h4 style={{marginBottom: 5, color: 'var(--dark)'}}>{item.title}</h4><p style={{color: 'var(--gray)', fontSize: 14, margin: 0}}>{item.desc}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{position: 'relative', padding: '100px 0', overflow: 'hidden'}}>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/images/cta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.7))'}}></div>
                <div className="section-container" style={{position: 'relative', zIndex: 2, textAlign: 'center'}}>
                    <h2 style={{fontSize: 42, fontWeight: 700, color: '#fff', marginBottom: 20}}>Siap Mencuci Pakaian Anda?</h2>
                    <p style={{fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px'}}>Hubungi kami sekarang dan rasakan kemudahan layanan laundry premium!</p>
                    <div style={{display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap'}}>
                        <a href="https://wa.me/6281217607101" className="btn" target="_blank" rel="noreferrer" style={{background: '#25D366', color: '#fff', padding: '15px 35px', fontSize: 16, display: 'flex', alignItems: 'center', gap: 10}}><FaWhatsapp size={20} /> Chat WhatsApp</a>
                        <Link to="/signup" className="btn" style={{background: '#fff', color: 'var(--gold-dark)', padding: '15px 35px', fontSize: 16}}>Daftar Sekarang</Link>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: 40, marginTop: 50, flexWrap: 'wrap'}}>
                        {['Gratis Antar Jemput', 'Garansi Cucian Bersih', 'Pembayaran Mudah'].map((item, i) => (
                            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 8, color: '#fff'}}><FaCheckCircle /><span>{item}</span></div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="section" id="contact">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Kontak</span>
                        <h2 className="section-title">Hubungi Kami</h2>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40}}>
                        <div>
                            {[
                                { icon: <FaMapMarkerAlt />, title: 'Alamat', text: 'Jl. MT Haryono No. 4C, Sukasari, Tangerang 15118' },
                                { icon: <FaWhatsapp />, title: 'WhatsApp', text: '+62 812-1760-7101' },
                                { icon: <FaClock />, title: 'Jam Operasional', text: 'Senin - Sabtu: 08:00 - 21:00' },
                            ].map((c, i) => (
                                <div key={i} style={{display: 'flex', gap: 20, marginBottom: 35}}>
                                    <div style={{width: 60, height: 60, background: 'var(--light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'var(--gold)'}}>{c.icon}</div>
                                    <div><h4 style={{marginBottom: 8}}>{c.title}</h4><p style={{color: 'var(--gray)'}}>{c.text}</p></div>
                                </div>
                            ))}
                        </div>
                        <div style={{borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)', height: 300}}>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d106.6!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890" width="100%" height="100%" style={{border: 0}} allowFullScreen loading="lazy" title="map"></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="section-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <img src="/images/logo.png" alt="Mory Laundry" style={{height: 60}} />
                            <p>Mory Laundry adalah layanan laundry premium yang berkomitmen memberikan hasil terbaik.</p>
                            <div className="footer-social">
                                <a href="#"><FaFacebook /></a>
                                <a href="#"><FaInstagram /></a>
                                <a href="https://wa.me/6281217607101" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="footer-title">Layanan</h4>
                            <ul className="footer-links">
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Cuci Kering</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Cuci Setrika</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Cuci Sepatu</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Cuci Bedcover</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-title">Link Cepat</h4>
                            <ul className="footer-links">
                                <li><a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Beranda</a></li>
                                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')}>Layanan</a></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/signup">Daftar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-title">Kontak</h4>
                            <ul className="footer-links">
                                <li>Jl. MT Haryono No. 4C, Sukasari, Tangerang</li>
                                <li>+62 812-1760-7101</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copy">&copy; 2025 Mory Laundry. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Float */}
            <a href="https://wa.me/6281217607101" className="whatsapp-float" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
        </>
    );
};

export default Home;