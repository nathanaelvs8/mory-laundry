import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI } from '../services/api';
import { FaCrown, FaWhatsapp, FaMapMarkerAlt, FaClock, FaMedal, FaBolt, FaTags, FaHeadset, FaFacebook, FaInstagram, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const [services, setServices] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        loadServices();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadServices = async () => {
        try {
            const res = await servicesAPI.getAll();
            setServices(res.data.data);
        } catch (err) { console.error(err); }
    };

    const handleScroll = () => setScrolled(window.scrollY > 50);

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

    const pricingData = [
        { icon: '🧺', name: 'Cuci Kering', desc: 'Cuci + Kering', price: 22000, unit: 'per 5 kg' },
        { icon: '👔', name: 'Cuci Kering Lipat', desc: 'Cuci + Kering + Lipat', price: 25000, unit: 'per 5 kg', featured: true },
        { icon: '✨', name: 'Cuci Kering Setrika', desc: 'Cuci + Kering + Setrika', price: 40000, unit: 'per 5 kg' },
        { icon: '👟', name: 'Sepatu', desc: 'Semua jenis sepatu', price: 25000, unit: 'per pasang' },
        { icon: '🛏️', name: 'Bedcover Besar', desc: 'Ukuran King/Queen', price: 35000, unit: 'per pcs' },
        { icon: '🛏️', name: 'Bedcover Kecil', desc: 'Ukuran Single', price: 25000, unit: 'per pcs' },
        { icon: '🧸', name: 'Boneka Besar', desc: 'Ukuran > 50cm', price: 35000, unit: 'per pcs' },
        { icon: '🧸', name: 'Boneka Kecil', desc: 'Ukuran < 50cm', price: 25000, unit: 'per pcs' },
        { icon: '🏠', name: 'Karpet', desc: 'Per meter persegi', price: 15000, unit: 'per m²' },
    ];

    return (
        <>
            {/* Navbar */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo"><img src="/images/logo.png" alt="Mory Laundry" /></Link>
                    <ul className="navbar-menu">
                        <li><a href="#home">Beranda</a></li>
                        <li><a href="#services">Layanan</a></li>
                        <li><a href="#pricing">Harga</a></li>
                        <li><a href="#contact">Kontak</a></li>
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
                            <a href="#services" className="btn btn-outline">Lihat Layanan</a>
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
                        <span className="section-badge">Layanan Kami</span>
                        <h2 className="section-title">Pilihan Layanan Laundry Lengkap</h2>
                        <p className="section-desc">Kami menyediakan berbagai layanan laundry untuk memenuhi kebutuhan Anda</p>
                    </div>
                    <div className="services-grid">
                        {[
                            { img: '/images/cuci-standard.jpg', name: 'Cuci Kering Lipat', desc: 'Paket lengkap cuci, kering, dan lipat rapi.', price: 25000, unit: '5 kg' },
                            { img: '/images/cuci-setrika.jpg', name: 'Cuci Kering Setrika', desc: 'Paket premium dengan hasil setrika rapi.', price: 40000, unit: '5 kg' },
                            { img: '/images/sepatu.jpg', name: 'Cuci Sepatu', desc: 'Cuci sepatu semua jenis hingga bersih.', price: 25000, unit: 'pasang' },
                            { img: '/images/bedcover.png', name: 'Cuci Bedcover', desc: 'Bedcover bersih, wangi, dan bebas tungau.', price: 25000, unit: 'pcs' },
                            { img: '/images/boneka.jpg', name: 'Cuci Boneka', desc: 'Boneka bersih, fluffy, dan aman.', price: 25000, unit: 'pcs' },
                            { img: '/images/karpet.jpg', name: 'Cuci Karpet', desc: 'Karpet bersih dan segar kembali.', price: 15000, unit: 'm²' },
                        ].map((s, i) => (
                            <div className="service-card" key={i}>
                                <div className="service-img"><img src={s.img} alt={s.name} /></div>
                                <div className="service-body">
                                    <h3 className="service-name">{s.name}</h3>
                                    <p className="service-text">{s.desc}</p>
                                    <div className="service-footer">
                                        <div><span className="service-price">Rp {formatPrice(s.price)}</span><span className="service-unit">/ {s.unit}</span></div>
                                        <a href={`https://wa.me/6281217607101?text=Halo,%20saya%20mau%20order%20${s.name}`} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">Order</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us - With Staff Image */}
            <section className="section" id="why-us" style={{background: '#fff'}}>
                <div className="section-container">
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center'}}>
                        {/* Image Side */}
                        <div style={{position: 'relative'}}>
                            <div style={{
                                borderRadius: 20,
                                overflow: 'hidden',
                                boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                                position: 'relative'
                            }}>
                                <img 
                                    src="/images/staff.jpg" 
                                    alt="Staff Mory Laundry" 
                                    style={{
                                        width: '100%',
                                        height: 450,
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                                {/* Overlay Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 20,
                                    left: 20,
                                    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                                    color: '#fff',
                                    padding: '15px 25px',
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    boxShadow: '0 10px 30px rgba(201,162,39,0.4)'
                                }}>
                                    <div style={{fontSize: 24, fontWeight: 700}}>5+ Tahun</div>
                                    <div style={{fontSize: 14, opacity: 0.9}}>Pengalaman Melayani</div>
                                </div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div>
                            <span className="section-badge" style={{marginBottom: 15, display: 'inline-block'}}>Mengapa Pilih Kami</span>
                            <h2 style={{fontSize: 36, fontWeight: 700, marginBottom: 20, color: 'var(--dark)'}}>
                                Layanan Laundry Terpercaya untuk Keluarga Anda
                            </h2>
                            <p style={{color: 'var(--gray)', marginBottom: 30, lineHeight: 1.8}}>
                                Kami berkomitmen memberikan layanan laundry terbaik dengan hasil yang memuaskan. 
                                Tim profesional kami siap melayani dengan sepenuh hati.
                            </p>

                            <div style={{display: 'grid', gap: 20}}>
                                {[
                                    { icon: <FaMedal />, title: 'Kualitas Terjamin', desc: 'Hasil cucian bersih, wangi, dan rapi setiap saat' },
                                    { icon: <FaBolt />, title: 'Proses Cepat', desc: 'Layanan express 1 hari selesai untuk kebutuhan mendesak' },
                                    { icon: <FaTags />, title: 'Harga Terjangkau', desc: 'Harga bersaing dengan kualitas premium' },
                                    { icon: <FaHeadset />, title: 'Layanan 24/7', desc: 'Customer service siap membantu kapan saja' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        gap: 15,
                                        padding: 20,
                                        background: 'var(--light)',
                                        borderRadius: 12,
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <div style={{
                                            width: 50,
                                            height: 50,
                                            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                                            borderRadius: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 20,
                                            flexShrink: 0
                                        }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 style={{marginBottom: 5, color: 'var(--dark)'}}>{item.title}</h4>
                                            <p style={{color: 'var(--gray)', fontSize: 14, margin: 0}}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="section" id="pricing" style={{background: 'var(--light)'}}>
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Daftar Harga</span>
                        <h2 className="section-title">Harga Transparan & Terjangkau</h2>
                    </div>
                    <div className="pricing-grid">
                        {pricingData.map((p, i) => (
                            <div className={`pricing-card ${p.featured ? 'featured' : ''}`} key={i}>
                                <div className="pricing-icon">{p.icon}</div>
                                <h3 className="pricing-name">{p.name}</h3>
                                <p className="pricing-desc">{p.desc}</p>
                                <div className="pricing-amount">Rp {formatPrice(p.price)}</div>
                                <span className="pricing-unit">{p.unit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA - With Background Image */}
            <section style={{
                position: 'relative',
                padding: '100px 0',
                overflow: 'hidden'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(/images/cta.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}></div>
                
                {/* Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(184,148,31,0.9) 100%)',
                    zIndex: 1
                }}></div>

                {/* Content */}
                <div className="section-container" style={{position: 'relative', zIndex: 2, textAlign: 'center'}}>
                    <h2 style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 20,
                        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                    }}>
                        Siap Mencuci Pakaian Anda?
                    </h2>
                    <p style={{
                        fontSize: 18,
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: 40,
                        maxWidth: 600,
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Hubungi kami sekarang dan rasakan kemudahan layanan laundry premium dengan hasil yang memuaskan!
                    </p>
                    <div style={{display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap'}}>
                        <a 
                            href="https://wa.me/6281217607101" 
                            className="btn" 
                            target="_blank" 
                            rel="noreferrer"
                            style={{
                                background: '#25D366',
                                color: '#fff',
                                padding: '15px 35px',
                                fontSize: 16,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                boxShadow: '0 10px 30px rgba(37,211,102,0.4)'
                            }}
                        >
                            <FaWhatsapp size={20} /> Chat WhatsApp
                        </a>
                        <Link 
                            to="/signup" 
                            className="btn"
                            style={{
                                background: '#fff',
                                color: 'var(--gold-dark)',
                                padding: '15px 35px',
                                fontSize: 16,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                        >
                            Daftar Sekarang
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 40,
                        marginTop: 50,
                        flexWrap: 'wrap'
                    }}>
                        {[
                            'Gratis Antar Jemput',
                            'Garansi Cucian Bersih',
                            'Pembayaran Mudah'
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: '#fff'
                            }}>
                                <FaCheckCircle />
                                <span>{item}</span>
                            </div>
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
                            <img src="/images/logo.png" alt="Mory Laundry" style={{height: 50}} />
                            <p>Mory Laundry adalah layanan laundry premium yang berkomitmen memberikan hasil terbaik untuk pakaian Anda.</p>
                            <div className="footer-social">
                                <a href="#"><FaFacebook /></a>
                                <a href="#"><FaInstagram /></a>
                                <a href="https://wa.me/6281217607101" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
                            </div>
                        </div>
                        <div>
                            <h4 className="footer-title">Layanan</h4>
                            <ul className="footer-links">
                                <li><a href="#services">Cuci Kering</a></li>
                                <li><a href="#services">Cuci Setrika</a></li>
                                <li><a href="#services">Cuci Sepatu</a></li>
                                <li><a href="#services">Cuci Bedcover</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="footer-title">Link Cepat</h4>
                            <ul className="footer-links">
                                <li><a href="#home">Beranda</a></li>
                                <li><a href="#pricing">Harga</a></li>
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
                        <p style={{color: 'rgba(255,255,255,.5)', fontSize: 14}}>Made for UAS AWP</p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp Float */}
            <a href="https://wa.me/6281217607101" className="whatsapp-float" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
        </>
    );
};

export default Home;