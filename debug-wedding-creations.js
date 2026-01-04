// Debug script for wedding creations issue
// Run this in browser console on the wedding page

async function debugWeddingCreations() {
  console.log('🔍 DEBUGGING WEDDING CREATIONS...');
  console.log('================================');

  try {
    // Test 1: Check if getActiveWeddingCreations function exists
    console.log('1. Checking if getActiveWeddingCreations exists...');
    if (typeof window.getActiveWeddingCreations === 'undefined') {
      console.log('❌ getActiveWeddingCreations not found in global scope');
    } else {
      console.log('✅ getActiveWeddingCreations found');
    }

    // Test 2: Import and test the function
    console.log('\n2. Testing getActiveWeddingCreations function...');
    const { getActiveWeddingCreations } = await import('./src/lib/api/wedding-creations.ts');
    console.log('✅ Function imported successfully');

    // Test 3: Call the function
    console.log('\n3. Calling getActiveWeddingCreations()...');
    const creations = await getActiveWeddingCreations();
    console.log('✅ API call completed');
    console.log('📊 Results:', creations);
    console.log('📊 Number of creations:', creations.length);

    if (creations.length === 0) {
      console.log('❌ No wedding creations returned');
      console.log('💡 Possible issues:');
      console.log('   - Database table empty');
      console.log('   - No records with is_active = true');
      console.log('   - API authentication failed');
      console.log('   - Database proxy not working');
    } else {
      console.log('✅ Wedding creations found!');
      console.log('🔍 Checking image URLs...');

      creations.forEach((creation, index) => {
        console.log(`   Creation ${index + 1}:`, {
          id: creation.id,
          title: creation.title,
          is_active: creation.is_active,
          image_url: creation.image_url
        });

        if (!creation.image_url || creation.image_url.trim() === '') {
          console.log(`❌ Creation ${index + 1} has no image URL`);
        } else {
          console.log(`✅ Creation ${index + 1} has image URL: ${creation.image_url}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
    console.error('💡 This indicates the API call is failing');

    if (error.message.includes('401')) {
      console.log('🔑 API authentication failed - check API keys');
    } else if (error.message.includes('403')) {
      console.log('🚫 CORS or origin not allowed');
    } else if (error.message.includes('500')) {
      console.log('🔧 Server error - check Netlify function logs');
    }
  }

  console.log('\n================================');
  console.log('🔍 DEBUG COMPLETE');
}

// Auto-run the debug
debugWeddingCreations();
