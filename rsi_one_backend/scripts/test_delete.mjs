import fetch from 'node-fetch';

async function testDelete() {
  try {
    // Login first
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    const token = loginData.session.access_token;

    console.log('Login successful, token:', token ? 'received' : 'not received');

    // Now delete
    const deleteResponse = await fetch('http://localhost:5000/api/auth/account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const deleteData = await deleteResponse.json();
    console.log('Delete response:', deleteData);

  } catch (error) {
    console.error('Error:', error);
  }
}

testDelete();