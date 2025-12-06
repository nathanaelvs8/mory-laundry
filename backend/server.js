const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Mory Laundry API is running!',
        timestamp: new Date().toISOString()
    });
});

// Serve React static files (production)
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║   🧺 MORY LAUNDRY Server Running! 🧺             ║
    ║                                                   ║
    ║   URL: http://localhost:${PORT}                      ║
    ║   API: http://localhost:${PORT}/api                  ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
    `);
});

module.exports = app;
