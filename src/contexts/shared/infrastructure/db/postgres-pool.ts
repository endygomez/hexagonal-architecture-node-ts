import { Pool } from "pg";

if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD) {
  throw new Error("Database connection parameters are not fully defined in the environment variables");
}

console.log('Configuring PostgreSQL connection pool...');

export const postgresPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: parseInt(process.env.DB_MAX_CLIENTS || "20", 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || "2000", 10)
});

postgresPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

postgresPool.on('connect', () => {
  console.log('New client connected to the database');
});

export const validateDatabaseConnection = async (): Promise<boolean> => {
  let client;
  try {
    console.log('Attempting to connect to database...');
    client = await postgresPool.connect();
    console.log('Database client acquired successfully');
    
    console.log('Testing database connection with SELECT 1...');
    await client.query('SELECT 1');
    console.log('Database connection is valid');
    return true;
    
  } catch (error) {
    console.error('Database connection validation failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw new Error('Database connection validation failed');
  } finally {
    if (client) {
      console.log('Releasing database client...');
      client.release();
    }
  }
}