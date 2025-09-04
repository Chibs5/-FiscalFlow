// test-direct-postgres.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testPostgresConnection() {
  console.log('Testing direct PostgreSQL connection...');
  
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection successful!');
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as count FROM users');
    console.log('Users table count:', result.rows[0].count);
    
    client.release();
    await pool.end();
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
  }
}

testPostgresConnection();