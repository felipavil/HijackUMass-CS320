import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
  user: 'your_postgres_user',
  host: 'localhost',
  database: 'carpool',
  password: 'your_password',
  port: 5432,
});

export default pool;
