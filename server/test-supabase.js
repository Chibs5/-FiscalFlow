// test-supabase.js
const { supabase, testConnection } = require('./config/supabase');

async function testDatabase() {
  console.log('Testing Supabase connection...');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    try {
      // Test querying categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('name, type')
        .limit(5);
      
      if (catError) throw catError;
      
      console.log('Sample categories:', categories.map(cat => cat.name));
      
      // Test users table
      const { count, error: userError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      console.log(`Users table ready - ${count} users`);
      console.log('Database setup complete!');
      
    } catch (error) {
      console.error('Error querying tables:', error.message);
    }
  }
  
  process.exit(0);
}

testDatabase();