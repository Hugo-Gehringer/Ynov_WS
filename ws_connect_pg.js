const { Pool } = require('pg');

const pool = new Pool({
    user: 'avnadmin',
    host: 'ynov-ws-ynov-ws.a.aivencloud.com',
    database: 'defaultdb',
    password: 'AVNS_s2aqljrfKWjH-t78J32',
    port: 25401,
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
    pool.end();
});