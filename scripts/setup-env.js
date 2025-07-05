#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Supabase Environment Setup');
console.log('=============================\n');

// Check if .env already exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('If you need to update your credentials, please edit the .env file manually.\n');
  process.exit(0);
}

// Create .env file with template
const envTemplate = `# Supabase Configuration
# Replace these with your actual Supabase project credentials
# Get these from your Supabase project dashboard: https://supabase.com/dashboard

EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Instructions:
# 1. Replace the placeholder values above with your actual Supabase credentials
# 2. Restart your development server
# 3. See SUPABASE_SETUP.md for detailed setup instructions
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env file successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Edit the .env file and replace the placeholder values with your Supabase credentials');
  console.log('2. Get your credentials from: https://supabase.com/dashboard');
  console.log('3. Restart your development server');
  console.log('4. Run the database schema in your Supabase SQL Editor (see SUPABASE_SETUP.md)');
  console.log('\n📖 For detailed instructions, see: SUPABASE_SETUP.md');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
} 