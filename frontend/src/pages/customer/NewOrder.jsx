import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { servicesAPI, ordersAPI } from '../../services/api.js';
import { FaPlus, FaTrash, FaCheck, FaArrowLeft } from 'react-icons/fa';

const CustomerNewOrder = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ customer_name: user?.full_name || '', phone_number: user?.phone_number || '', notes: '' });
    const [orderItems, setOrderItems] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        try {
            const res = await servicesAPI.getAll();
            setServices(res.data.data);
        } catch (err) { toast.error('Gagal memuat layanan'); }
        setLoading(false);
    };

    const handleAddItem = () => {
        if (!selectedService || !quantity || quantity <= 0) {
            toast.error('Pilih layanan dan masukkan jumlah'); return;
        }
        const service = services.find(s => s.id === parseInt(selectedService));
        if (!service) return;

        const subtotal = parseFloat(service.price) * parseFloat(quantity);
        setOrderItems([...orderItems, {
            service_id: service.id,
            service_name: service.service_name,
            unit: service.unit,
            price: parseFloat(service.price),
            quantity: parseFloat(quantity),
            subtotal
        }]);
        setSelectedService('');
        setQuantity('');
    };

    const handleRemoveItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customer_name || !formData.phone_number) {
            toast.error('Nama dan No. HP wajib diisi'); return;
        }
        if (orderItems.length === 0) {
            toast.error('Tambahkan minimal satu layanan'); return;
        }
        if (!window.confirm('Buat pesanan ini?')) return;

        setSubmitting(true);
        try {
            const res = await ordersAPI.create({
                customer_name: formData.customer_name,
                phone_number: formData.phone_number,
                notes: formData.notes,
                items: orderItems
            });
            toast.success(res.data.message);
            navigate(`/customer/orders/${res.data.data.id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal membuat pesanan');
        }
        setSubmitting(false);
    };

    const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price);

    return (
        <DashboardLayout title="Buat Pesanan Baru">
            <div className="table-container" style={{padding: 30}}>
                <form onSubmit={handleSubmit}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30}}>
                        <div className="form-group" style={{margin: 0}}>
                            <label className="form-label">Nama Pelanggan</label>
                            <input type="text" className="form-control" value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} required />
                        </div>
                        <div className="form-group" style={{margin: 0}}>
                            <label className="form-label">Nomor HP</label>
                            <input type="tel" className="form-control" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} required />
                        </div>
                    </div>

                    <h4 style={{marginBottom: 15, paddingBottom: 10, borderBottom: '2px solid #eee'}}>Pilih Layanan</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 15, alignItems: 'end', marginBottom: 20}}>
                        <div className="form-group" style={{margin: 0}}>
                            <label className="form-label">Layanan</label>
                            <select className="form-control" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                <option value="">-- Pilih Layanan --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.service_name} - Rp {formatPrice(s.price)}/{s.unit}</option>)}
                            </select>
                        </div>
                        <div className="form-group" style={{margin: 0, width: 120}}>
                            <label className="form-label">Jumlah</label>
                            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} step="0.1" min="0.1" placeholder="0" />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddItem}><FaPlus /> Tambah</button>
                    </div>

                    <table style={{marginBottom: 20}}>
                        <thead><tr><th>Layanan</th><th style={{textAlign: 'center'}}>Jumlah</th><th style={{textAlign: 'right'}}>Harga</th><th style={{textAlign: 'right'}}>Subtotal</th><th style={{width: 60}}></th></tr></thead>
                        <tbody>
                            {orderItems.length === 0 ? (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: 30, color: '#999'}}>Belum ada layanan dipilih</td></tr>
                            ) : orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.service_name}</td>
                                    <td style={{textAlign: 'center'}}>{item.quantity} {item.unit}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.price)}</td>
                                    <td style={{textAlign: 'right'}}>Rp {formatPrice(item.subtotal)}</td>
                                    <td><button type="button" className="action-btn delete" onClick={() => handleRemoveItem(index)}><FaTrash /></button></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18}}>TOTAL</td>
                                <td style={{textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: 'var(--gold)'}}>Rp {formatPrice(getTotalPrice())}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="form-group">
                        <label className="form-label">Catatan (Opsional)</label>
                        <textarea className="form-control" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Tambahkan catatan khusus jika ada..."></textarea>
                    </div>

                    <div style={{display: 'flex', gap: 15, marginTop: 25}}>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/customer/dashboard')}><FaArrowLeft /> Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || orderItems.length === 0}><FaCheck /> {submitting ? 'Memproses...' : 'Buat Pesanan'}</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CustomerNewOrder;
