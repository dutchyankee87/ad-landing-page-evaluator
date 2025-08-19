// Fix DATABASE_URL encoding issues
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL;
console.log('Current DATABASE_URL:', databaseUrl);

// Extract password and encode it properly
const urlParts = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@(.+)/);

if (urlParts) {
  const [, username, password, hostAndRest] = urlParts;
  
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Host and rest:', hostAndRest);
  
  // URL encode the password
  const encodedPassword = encodeURIComponent(password);
  console.log('Encoded password:', encodedPassword);
  
  const fixedUrl = `postgresql://${username}:${encodedPassword}@${hostAndRest}`;
  console.log('');
  console.log('✅ Fixed DATABASE_URL:');
  console.log(fixedUrl);
  console.log('');
  console.log('Please update your .env file with the fixed URL above');
}