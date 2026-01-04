// Direct test of database API for wedding creations
// Run this in browser console on the deployed site

async function testDatabaseAPI() {
  console.log('🧪 TESTING DATABASE API DIRECTLY...');

  const frontendApiKey = '7f498e8c71731a14887544f3c3c27aa7219154e93cb90a2811af380bcaf5cc52'; // Your API key

  try {
    console.log('📡 Making API call to database proxy...');

    const response = await fetch('/.netlify/functions/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': frontendApiKey
      },
      body: JSON.stringify({
        operation: 'select',
        table: 'wedding_creations',
        filters: { is_active: true },
        orderBy: { column: 'display_order', ascending: true }
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📊 Response data:', result);

    if (response.ok && result.success) {
      console.log('✅ Database API working!');
      console.log('📊 Wedding creations found:', result.data.length);

      if (result.data.length > 0) {
        console.log('🎉 Data sample:', result.data[0]);
        console.log('🔗 Image URLs:', result.data.map(item => item.image_url));
      } else {
        console.log('❌ No wedding creations with is_active = true');
        console.log('💡 Check database: SELECT * FROM wedding_creations WHERE is_active = true;');
      }
    } else {
      console.log('❌ API call failed');
      console.log('📝 Error:', result.error);

      if (response.status === 401) {
        console.log('🔐 Authentication failed - check API keys');
      } else if (response.status === 403) {
        console.log('🚫 Forbidden - check CORS or permissions');
      } else if (response.status === 500) {
        console.log('🔧 Server error - check Netlify function logs');
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error);
    console.log('💡 Possible causes:');
    console.log('   - CORS issue');
    console.log('   - Network connectivity');
    console.log('   - Function not deployed');
  }
}

// Run the test
testDatabaseAPI();
