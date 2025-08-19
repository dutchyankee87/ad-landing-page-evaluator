// Database setup script
// Run: node setup-db.js

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fs from 'fs';

// Load environment variables
config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env file');
  console.log('Please update your .env file with the correct DATABASE_URL including your password');
  process.exit(1);
}

if (databaseUrl.includes('[YOUR-PASSWORD]')) {
  console.error('❌ Please replace [YOUR-PASSWORD] in DATABASE_URL with your actual Supabase database password');
  console.log('1. Go to your Supabase project settings');
  console.log('2. Find your database password');
  console.log('3. Replace [YOUR-PASSWORD] in the .env file');
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log('🔗 Connecting to Supabase database...');
    
    // Test connection
    const client = postgres(databaseUrl, { prepare: false });
    const db = drizzle(client);
    
    // Test query
    await client`SELECT 1`;
    console.log('✅ Database connection successful!');
    
    console.log('📄 Reading migration file...');
    const migrationSql = fs.readFileSync('./drizzle/0000_opposite_princess_powerful.sql', 'utf8');
    
    console.log('🚀 Running migration...');
    await client.unsafe(migrationSql);
    
    console.log('✅ Database schema created successfully!');
    console.log('');
    console.log('🎉 Your Drizzle ORM setup is complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. npm run dev - Start your application');
    console.log('2. npm run db:studio - Open Drizzle Studio to view your database');
    console.log('');
    
    await client.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('');
      console.log('🔑 Password authentication failed. Please check:');
      console.log('1. Your DATABASE_URL password is correct');
      console.log('2. Your Supabase project is active');
      console.log('3. The connection string format is correct');
    } else if (error.message.includes('relation') && error.message.includes('already exists')) {
      console.log('');
      console.log('⚠️  Tables already exist. This is normal if you\'ve run this before.');
      console.log('✅ Your database is ready to use!');
    }
  }
}

setupDatabase();