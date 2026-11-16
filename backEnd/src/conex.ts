import { Pool } from "pg";
import env from 'dotenv';
env.config();

const pool: Pool = new Pool({
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: 5432,
  user: process.env.user,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(client => {
    console.log('Connection successful!');
    client.release();
  })
  .catch(err => {
    console.error('The config is not good or database is offline:', err.message);
  });

export default pool;