// simple-test.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Attempting connection to:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));
    
    const client = await pool.connect();
    console.log('Connection successful!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    
    client.release();
    await pool.end();
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testConnection();