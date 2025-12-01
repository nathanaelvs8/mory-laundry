require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mory_laundry_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    console.log('📊 Database:', dbConfig.database);
    console.log('🖥️  Host:', dbConfig.host);
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Test query result:', rows[0].result);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Host:', dbConfig.host);
    console.error('Database:', dbConfig.database);
    return false;
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🧺 Mory Laundry API is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  res.json({
    api: 'running',
    database: dbStatus ? 'connected ✅' : 'disconnected ❌',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Test query endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT DATABASE() as current_db, NOW() as server_time');
    res.json({
      success: true,
      data: rows[0],
      message: 'Database query successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log('\n🚀 ================================');
  console.log(`   Mory Laundry API`);
  console.log('   ================================');
  console.log(`   🌐 Server: http://localhost:${PORT}`);
  console.log(`   📅 Started: ${new Date().toLocaleString()}`);
  console.log('   ================================\n');
  
  // Test database connection on startup
  await testConnection();
});

// Export pool for use in other files
module.exports = { pool };