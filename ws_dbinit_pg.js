const { pool } = require('./ws_connect_pg');

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ws_masks (
      id SERIAL PRIMARY KEY,
      description VARCHAR(255),
      name VARCHAR(50),
      mask_json JSONB
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ws_entries (
      id SERIAL PRIMARY KEY,
      id_mask INTEGER REFERENCES ws_masks(id),
      entry_json JSONB
    );
  `);

  console.log('Initialisation de la base de données terminée.');
  await pool.end();
};

initDb().catch(console.error);
