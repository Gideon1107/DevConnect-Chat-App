import pg from 'pg'; // Import Client from pg
import dotenv from 'dotenv'; // Import dotenv for environment variables

dotenv.config(); // Load environment variables from .env file

const { Pool } = pg;

// Create a new PostgreSQL client
const db = new Pool({
  host: process.env.DB_HOST,         // PostgreSQL host (default is localhost)
  port: process.env.DB_PORT || 5432, // PostgreSQL port (default is 5432)
  user: process.env.DB_USER,         // PostgreSQL user
  password: process.env.DB_PASSWORD, // PostgreSQL password
  database: process.env.DB_NAME      // PostgreSQL database
});

// Async function to connect to PostgreSQL and run a query
const connectToDatabase = async () => {
  try {
    // Connect to PostgreSQL
    await db.connect();
    console.log('Connected to PostgreSQL!');

    // Run a simple query
    const res = await db.query('SELECT NOW()');
    console.log('Query result:', res.rows); // Print the current time
  } catch (err) {
    console.error('Error connecting to the database', err.stack);
  } finally {
    // Close the connection when done
    await db.end();
  }
};

// Call the async function to connect
connectToDatabase();
