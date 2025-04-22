import pg from 'pg';
const {Pool} = pg;

const pool = new Pool({
  user: 'poped',
  host: 'localhost',
  database: 'carpool',
  password: 'poped',
  port: 5432,
});

export default pool;
