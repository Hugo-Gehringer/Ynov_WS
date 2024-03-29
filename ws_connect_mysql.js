const mysql = require('mysql2/promise');

const connectionConfig = {
  host: 'ynov-ws-mysql-ynov-ws.a.aivencloud.com',
  user: 'avnadmin',
  database: 'defaultdb',
  password: 'AVNS_sQU6Hq1vCFXIsDD4qCK',
  port: 25401,
  ssl: {
    rejectUnauthorized: false
  }
};

async function connectAndQuery() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Connexion réussie à MySQL');

    // Test de la connexion et requête simple
    const [rows, fields] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('Le résultat de la requête est :', rows);

    await connection.end();
  } catch (error) {
    console.error('Erreur lors de la connexion à MySQL:', error);
  }
}

connectAndQuery();
