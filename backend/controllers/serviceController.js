const db = require('../config/koneksi');

// @desc    Get all services (public)
// @route   GET /api/services
const getAllServices = async (req, res, next) => {
    try {
        const [services] = await db.query(
            'SELECT * FROM services WHERE is_active = 1 ORDER BY service_name'
        );
        
        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all services (admin)
// @route   GET /api/services/admin/all
const getAllServicesAdmin = async (req, res, next) => {
    try {
        const [services] = await db.query('SELECT * FROM services ORDER BY id');
        
        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
const getService = async (req, res, next) => {
    try {
        const [services] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
        
        if (services.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Layanan tidak ditemukan'
            });
        }
        
        res.json({
            success: true,
            data: services[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create service
// @route   POST /api/services
const createService = async (req, res, next) => {
    try {
        const { service_name, unit, price, description } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO services (service_name, unit, price, description) VALUES (?, ?, ?, ?)',
            [service_name, unit, price, description || null]
        );
        
        const [newService] = await db.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
        
        res.status(201).json({
            success: true,
            message: 'Layanan berhasil ditambahkan',
            data: newService[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
const updateService = async (req, res, next) => {
    try {
        const { service_name, unit, price, description, is_active } = req.body;
        
        const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [req.params.id]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Layanan tidak ditemukan'
            });
        }
        
        await db.query(
            'UPDATE services SET service_name = ?, unit = ?, price = ?, description = ?, is_active = ? WHERE id = ?',
            [service_name, unit, price, description || null, is_active !== undefined ? is_active : 1, req.params.id]
        );
        
        const [updatedService] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: 'Layanan berhasil diupdate',
            data: updatedService[0]
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
const deleteService = async (req, res, next) => {
    try {
        const [existing] = await db.query('SELECT id FROM services WHERE id = ?', [req.params.id]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Layanan tidak ditemukan'
            });
        }
        
        await db.query('DELETE FROM services WHERE id = ?', [req.params.id]);
        
        res.json({
            success: true,
            message: 'Layanan berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllServices,
    getAllServicesAdmin,
    getService,
    createService,
    updateService,
    deleteService
};
