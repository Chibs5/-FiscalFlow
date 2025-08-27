// test-db.js
const { testConnection, query } = require('./config/database');

async function testDatabase() {
  console.log('Testing database connection...');
  
  // Test basic connection
  const isConnected = await testConnection();
  
  if (isConnected) {
    try {
      // Test querying tables
      const result = await query('SELECT COUNT(*) FROM categories');
      console.log(`✅ Found ${result.rows[0].count} default categories`);
      
      // Test users table
      const userCount = await query('SELECT COUNT(*) FROM users');
      console.log(`✅ Users table ready - ${userCount.rows[0].count} users`);
      
      console.log('🎉 Database setup complete!');
    } catch (error) {
      console.error('❌ Error querying tables:', error.message);
    }
  }
  
  process.exit(0);
}

testDatabase();