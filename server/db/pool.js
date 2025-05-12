import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'carpool',
  password: 'apple1',
  port: 5432,
});

export default pool;
