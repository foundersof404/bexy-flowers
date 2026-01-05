
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
    console.log('Error: .env file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const keys = envContent.split('\n').map(line => line.split('=')[0].trim()).filter(Boolean);

const requiredKeys = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_FRONTEND_API_KEY', 'FRONTEND_API_KEY'];
const missingKeys = requiredKeys.filter(key => !keys.includes(key));

if (missingKeys.length > 0) {
    console.log('Missing keys:', missingKeys.join(', '));
} else {
    console.log('All required keys are present.');
}
