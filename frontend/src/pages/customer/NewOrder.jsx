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
    const getUnitLabel = (unit) => ({ 'kg': 'Kilogram (kg)', 'pcs': 'Pieces (pcs)', 'pasang': 'Pasang', 'm²': 'Meter persegi (m²)' }[unit] || unit);
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
            <div className="table-container" style={{ padding: 30 }}>
                <form onSubmit={handleSubmitClick}>
                    <h4 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)' }}>📋 Info Pelanggan</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Nama Pelanggan *</label>
                            <input type="text" className="form-control" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} required />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Nomor HP *</label>
                            <input type="tel" className="form-control" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} required />
                        </div>
                    </div>

                    <h4 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)' }}>🧺 Pilih Layanan</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px auto', gap: 15, alignItems: 'end', marginBottom: 20 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Layanan</label>
                            <select className="form-control" value={selectedService} onChange={(e) => { setSelectedService(e.target.value); setQuantity(''); }}>
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.service_name} - Rp {formatPrice(s.price)}/{s.unit}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label">Jumlah {selectedServiceObj ? `(${selectedServiceObj.unit})` : ''}</label>
                            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} step={selectedServiceObj ? getStepValue(selectedServiceObj.unit) : '1'} min={selectedServiceObj ? getMinValue(selectedServiceObj.unit) : '1'} disabled={!selectedService} />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddItem} disabled={!selectedService || !quantity} style={{ height: 48 }}><FaPlus /> Tambah</button>
                    </div>

                    <table style={{ marginBottom: 20 }}>
                        <thead><tr><th>Layanan</th><th style={{ textAlign: 'center' }}>Jumlah</th><th style={{ textAlign: 'right' }}>Harga</th><th style={{ textAlign: 'right' }}>Subtotal</th><th style={{ width: 60 }}></th></tr></thead>
                        <tbody>
                            {orderItems.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#999' }}>Belum ada layanan dipilih</td></tr>
                                : orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.service_name}</strong></td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity} {item.unit}</td>
                                        <td style={{ textAlign: 'right' }}>Rp {formatPrice(item.price)}/{item.unit}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600 }}>Rp {formatPrice(item.subtotal)}</td>
                                        <td><button type="button" className="btn btn-sm" onClick={() => handleRemoveItem(index)} style={{ background: '#fee', color: '#d00', padding: '8px 12px' }}><FaTrash /></button></td>
                                    </tr>
                                ))}
                        </tbody>
                        <tfoot><tr style={{ background: '#f9f9f9' }}><td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18, padding: 15 }}>TOTAL</td><td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 20, color: 'var(--gold)', padding: 15 }}>Rp {formatPrice(getTotalPrice())}</td><td></td></tr></tfoot>
                    </table>

                    <h4 style={{ marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid #eee', color: 'var(--gold)' }}>📍 Alamat & Catatan</h4>

                    <div className="form-group">
                        <label className="form-label">Alamat Pengiriman / Pengambilan</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Masukkan alamat lengkap untuk pengiriman atau pengambilan cucian"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Catatan Tambahan</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Catatan khusus untuk pesanan (contoh: jangan dicampur, pisahkan warna, dll)"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: 15, marginTop: 25 }}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/customer/dashboard')}><FaArrowLeft /> Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || orderItems.length === 0} style={{ flex: 1 }}><FaCheck /> {submitting ? 'Memproses...' : `Buat Pesanan (Rp ${formatPrice(getTotalPrice())})`}</button>
                    </div>
                </form>
            </div>

            <ConfirmModal isOpen={confirmModal} onClose={() => setConfirmModal(false)} onConfirm={handleConfirmSubmit} title="Buat Pesanan?" message={`Total pesanan: Rp ${formatPrice(getTotalPrice())}. Lanjutkan membuat pesanan?`} type="warning" />
        </DashboardLayout>
    );
};

export default CustomerNewOrder;