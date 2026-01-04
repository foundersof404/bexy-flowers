// Test script to check wedding creations database
// Run this in browser console on the deployed site

async function testWeddingCreations() {
  console.log('🔍 Testing Wedding Creations Database...');

  try {
    // Test database proxy directly
    const response = await fetch('/.netlify/functions/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key' // Will be validated by backend
      },
      body: JSON.stringify({
        operation: 'select',
        table: 'wedding_creations',
        filters: { is_active: true }
      })
    });

    const result = await response.json();

    console.log('Database response:', response.status, result);

    if (response.ok && result.success) {
      console.log('✅ Database proxy working!');
      console.log('Found wedding creations:', result.data.length);
      console.log('Wedding creations:', result.data);
    } else {
      console.log('❌ Database proxy error:', result.error);
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testWeddingCreations();
