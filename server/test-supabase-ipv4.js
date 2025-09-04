// test-supabase-ipv4.js
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Force IPv4 DNS resolution
const agent = new https.Agent({
  family: 4, // Force IPv4
  timeout: 10000
});

// Create Supabase client with custom agent
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          agent
        });
      }
    }
  }
);

async function testConnection() {
  console.log('Testing Supabase with IPv4 forcing...');
  console.log('URL:', process.env.SUPABASE_URL);
  
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    
    console.log('Success! Users table count:', count);
    
  } catch (error) {
    console.error('Failed:', error.message);
    
    // Let's also try a simple HTTP request to test connectivity
    console.log('\nTrying direct HTTP test...');
    try {
      const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/', {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY
        }
      });
      console.log('Direct HTTP status:', response.status);
    } catch (httpError) {
      console.error('HTTP test also failed:', httpError.message);
    }
  }
}

testConnection();