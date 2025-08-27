// test-auth.js
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('Testing Authentication System...\n');

    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });
    
    console.log('✅ Registration successful');
    console.log('User:', registerResponse.data.user);
    
    const token = registerResponse.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');

    // Test 2: Login with the same user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    console.log('User:', loginResponse.data.user);

    // Test 3: Get user profile (protected route)
    console.log('\n3. Testing protected route (get profile)...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile fetch successful');
    console.log('Profile:', profileResponse.data.user);

    // Test 4: Verify token
    console.log('\n4. Testing token verification...');
    const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Token verification successful');
    console.log('Valid:', verifyResponse.data.valid);

    console.log('\n🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuth();