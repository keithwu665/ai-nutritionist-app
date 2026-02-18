import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, name, isActive, deletedAt FROM fitasty_products ORDER BY id');
console.log('Database products:');
rows.forEach(r => {
  console.log(`  ID ${r.id}: ${r.name} | Active: ${r.isActive} | Deleted: ${r.deletedAt}`);
});
await conn.end();
