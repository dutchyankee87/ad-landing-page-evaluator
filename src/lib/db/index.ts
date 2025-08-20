import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection for server-side use only
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/dbname';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };