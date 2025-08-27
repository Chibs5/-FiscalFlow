// config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection function
const testConnection = async () => {
  try {
    // Test by querying the categories table
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('Supabase connected successfully');
    console.log(`Found ${data} categories in database`);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};