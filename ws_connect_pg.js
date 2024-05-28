const { Pool } = require('pg');

const pool = new Pool({
    user: 'avnadmin',
    host: 'pg-187a41f5-ynovws.b.aivencloud.com',
    database: 'defaultdb',
    password: 'AVNS_2K9mLXn17GT-GTry2rr',
    port: 14130,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test de la connexion et requête simple
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connexion réussie à PostgreSQL:', res.rows);
});

module.exports = { pool };