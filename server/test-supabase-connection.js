// test-supabase-connection.js
const { supabase } = require('./config/supabase');
require('dotenv').config();

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.SUPABASE_ANON_KEY);
  
  try {
    // Test 1: Simple query to users table
    console.log('\n1. Testing users table access...');
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Users table error:', error.message);
      return;
    }
    
    console.log('✅ Users table accessible, count:', count);
    
    // Test 2: Try to query categories table
    console.log('\n2. Testing categories table...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name')
      .limit(3);
    
    if (catError) {
      console.error('Categories error:', catError.message);
      return;
    }
    
    console.log('✅ Categories found:', categories?.map(c => c.name));
    
    console.log('\n🎉 Supabase connection successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testSupabaseConnection();