// Test Drizzle ORM connection and operations
// Run: node test-drizzle.js

import { config } from 'dotenv';
import { db } from './src/lib/db/index.js';
import { createUser, getUserByEmail, canUserEvaluate } from './src/lib/db/queries.js';

// Load environment variables
config();

async function testDrizzle() {
  try {
    console.log('🧪 Testing Drizzle ORM...');
    
    // Test database connection
    console.log('1. Testing database connection...');
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Test user creation
    console.log('2. Testing user operations...');
    const testUser = {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      fullName: 'Test User',
      subscriptionTier: 'free'
    };
    
    const user = await createUser(testUser);
    console.log('✅ User created:', user.email);
    
    // Test user retrieval
    const retrievedUser = await getUserByEmail('test@example.com');
    console.log('✅ User retrieved:', retrievedUser?.email);
    
    // Test usage limits
    console.log('3. Testing usage limits...');
    const canEvaluate = await canUserEvaluate(user.id);
    console.log('✅ Can user evaluate:', canEvaluate);
    
    console.log('');
    console.log('🎉 All Drizzle tests passed!');
    console.log('Your database integration is working correctly.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Drizzle test failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('');
      console.log('🔗 Connection issue. Please check:');
      console.log('1. Your DATABASE_URL is correct');
      console.log('2. Your database password is correct');
      console.log('3. Your Supabase project is active');
    } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('');
      console.log('📄 Tables not found. Please run:');
      console.log('node setup-db.js');
    }
    
    process.exit(1);
  }
}

testDrizzle();