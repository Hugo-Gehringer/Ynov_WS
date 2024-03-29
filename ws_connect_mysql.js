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

async function connectMySQL() {
  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Connexion réussie à MySQL');
    return connection;
  } catch (error) {
    console.error('Erreur lors de la connexion à MySQL:', error);
    throw error; 
  }
}

module.exports = connectMySQL;

// Pour tester la connexion directement lorsque ce fichier est exécuté
if (require.main === module) {
  connectMySQL().then(connection => {
    connection.end();
  }).catch(console.error);
}