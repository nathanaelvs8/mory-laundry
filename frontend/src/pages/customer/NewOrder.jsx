import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { useAuth } from '../../context/AuthContext';
import { servicesAPI, ordersAPI } from '../../services/api';
import { FaPlus, FaTrash, FaCheck, FaArrowLeft } from 'react-icons/fa';

const CustomerNewOrder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: user?.full_name || '',
        phone_number: user?.phone_number || '',
        address: '',
        notes: ''
    });
    const [orderItems, setOrderItems] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [quantity, setQuantity] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        try {
            const res = await servicesAPI.getAll();
            setServices(res.data.data || []);
        } catch (err) { toast.error('Gagal memuat layanan'); }
        setLoading(false);
    };

    const getSelectedServiceObj = () => services.find(s => s.id === parseInt(selectedService));
    const getStepValue = (unit) => unit === 'kg' ? '0.1' : '1';
    const getMinValue = (unit) => unit === 'kg' ? '0.1' : '1';

    const handleAddItem = () => {
        if (!selectedService || !quantity || parseFloat(quantity) <= 0) { toast.error('Pilih layanan dan masukkan jumlah'); return; }
        const service = getSelectedServiceObj();
        if (!service) return;
        if (orderItems.find(item => item.service_id === service.id)) { toast.error('Layanan sudah ditambahkan'); return; }
        const qty = parseFloat(quantity);
        setOrderItems([...orderItems, { service_id: service.id, service_name: service.service_name, unit: service.unit, price: parseFloat(service.price), quantity: qty, subtotal: service.price * qty }]);
        setSelectedService(''); setQuantity('');
        toast.success('Layanan ditambahkan');
    };

    const handleRemoveItem = (index) => { setOrderItems(orderItems.filter((_, i) => i !== index)); };
    const getTotalPrice = () => orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (!formData.customer_name || !formData.phone_number) { toast.error('Nama dan No. HP wajib diisi'); return; }
        if (orderItems.length === 0) { toast.error('Tambahkan minimal satu layanan'); return; }
        setConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await ordersAPI.create({
                customer_name: formData.customer_name,
                phone_number: formData.phone_number,
                address: formData.address,
                notes: formData.notes,
                items: orderItems
            });
            toast.success(res.data.message || 'Pesanan berhasil dibuat!');
            navigate(`/customer/orders/${res.data.data.id}`);
        } catch (err) { toast.error(err.response?.data?.message || 'Gagal membuat pesanan'); }
        setSubmitting(false);
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);
    const selectedServiceObj = getSelectedServiceObj();

    return (
        <DashboardLayout title="Buat Pesanan Baru">
            <div className="table-container" style={{ padding: '20px' }}>
                <form onSubmit={handleSubmitClick}>
                    {/* Info Pelanggan */}
                    <h4 style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)', fontSize: 16 }}>📋 Info Pelanggan</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15, marginBottom: 25 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{fontSize: 13}}>Nama Pelanggan *</label>
                            <input type="text" className="form-control" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{fontSize: 13}}>Nomor HP *</label>
                            <input type="tel" className="form-control" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} required />
                        </div>
                    </div>

                    {/* Pilih Layanan */}
                    <h4 style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)', fontSize: 16 }}>🧺 Pilih Layanan</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 15 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{fontSize: 13}}>Layanan</label>
                            <select className="form-control" value={selectedService} onChange={(e) => { setSelectedService(e.target.value); setQuantity(''); }}>
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.service_name} - Rp {formatPrice(s.price)}/{s.unit}</option>)}
                            </select>
                        </div>
                        <div style={{display: 'flex', gap: 10}}>
                            <div className="form-group" style={{ margin: 0, flex: 1 }}>
                                <label className="form-label" style={{fontSize: 13}}>Jumlah {selectedServiceObj ? `(${selectedServiceObj.unit})` : ''}</label>
                                <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} step={selectedServiceObj ? getStepValue(selectedServiceObj.unit) : '1'} min={selectedServiceObj ? getMinValue(selectedServiceObj.unit) : '1'} disabled={!selectedService} />
                            </div>
                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                                <button type="button" className="btn btn-primary" onClick={handleAddItem} disabled={!selectedService || !quantity} style={{ height: 48, whiteSpace: 'nowrap' }}><FaPlus /> Tambah</button>
                            </div>
                        </div>
                    </div>

                    {/* Daftar Item - Cards */}
                    <div style={{marginBottom: 15}}>
                        {orderItems.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 30, color: '#999', background: '#f9f9f9', borderRadius: 8 }}>Belum ada layanan dipilih</div>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                                {orderItems.map((item, index) => (
                                    <div key={index} style={{
                                        background: '#f9f9f9',
                                        borderRadius: 10,
                                        padding: 12,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 10
                                    }}>
                                        <div style={{flex: 1}}>
                                            <div style={{fontWeight: 600, fontSize: 14, marginBottom: 4}}>{item.service_name}</div>
                                            <div style={{fontSize: 12, color: '#666'}}>{item.quantity} {item.unit} × Rp {formatPrice(item.price)}</div>
                                            <div style={{fontSize: 14, fontWeight: 600, color: 'var(--gold)', marginTop: 4}}>Rp {formatPrice(item.subtotal)}</div>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveItem(index)} style={{ background: '#fee', color: '#d00', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}><FaTrash /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                        borderRadius: 10,
                        padding: 15,
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 20
                    }}>
                        <span style={{fontSize: 14, fontWeight: 500}}>TOTAL</span>
                        <span style={{fontSize: 20, fontWeight: 700}}>Rp {formatPrice(getTotalPrice())}</span>
                    </div>

                    {/* Alamat & Catatan */}
                    <h4 style={{ marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)', fontSize: 16 }}>📍 Alamat & Catatan</h4>

                    <div className="form-group">
                        <label className="form-label" style={{fontSize: 13}}>Alamat Pengiriman / Pengambilan</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Alamat lengkap (opsional)"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{fontSize: 13}}>Catatan Tambahan</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan khusus (opsional)"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/customer/dashboard')} style={{flex: '0 0 auto'}}><FaArrowLeft /> Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || orderItems.length === 0} style={{ flex: 1, minWidth: 200 }}><FaCheck /> {submitting ? 'Memproses...' : `Buat Pesanan`}</button>
                    </div>
                </form>
            </div>

            <ConfirmModal isOpen={confirmModal} onClose={() => setConfirmModal(false)} onConfirm={handleConfirmSubmit} title="Buat Pesanan?" message={`Total pesanan: Rp ${formatPrice(getTotalPrice())}. Lanjutkan membuat pesanan?`} type="warning" />
        </DashboardLayout>
    );
};

export default CustomerNewOrder;