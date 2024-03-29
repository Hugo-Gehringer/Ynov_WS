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

async function create(description, name, mask_json) {
  const connection = await mysql.createConnection(connectionConfig);
  const [rows] = await connection.execute(
    'INSERT INTO ws_masks(description, name, mask_json) VALUES (?, ?, ?);',
    [description, name, JSON.stringify(mask_json)]
  );
  await connection.end();
  return rows.insertId;
}

async function read(id) {
  const connection = await mysql.createConnection(connectionConfig);
  const [rows] = await connection.execute('SELECT * FROM ws_masks WHERE id = ?;', [id]);
  await connection.end();
  return rows[0];
}

async function update(id, description, name, mask_json) {
  const connection = await mysql.createConnection(connectionConfig);
  await connection.execute(
    'UPDATE ws_masks SET description = ?, name = ?, mask_json = ? WHERE id = ?;',
    [description, name, JSON.stringify(mask_json), id]
  );
  await connection.end();
  return read(id);
}

async function remove(id) {
  const connection = await mysql.createConnection(connectionConfig);
  await connection.execute('DELETE FROM ws_masks WHERE id = ?;', [id]);
  await connection.end();
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD MySQL...");
  
    // Création
    const maskJson = { example: true };
    const createdId = await create("Test Description", "Test Name", maskJson);
    console.log("Création réussie, id:", createdId);
  
    // Lecture
    const readMask = await read(createdId);
    console.log("Lecture réussie:", readMask);
  
    // Mise à jour
    const updatedMaskJson = { example: false };
    const updated = await update(createdId, "Updated Description", "Updated Name", updatedMaskJson);
    console.log("Mise à jour réussie:", updated);
  
    // Suppression
    await remove(createdId);
    console.log("Suppression réussie.");
  
    // Vérifier la suppression
    const verifyRemove = await read(createdId);
    console.log("Vérification après suppression:", verifyRemove);
  
    console.log("Fin du test CRUD MySQL.");
}

testCRUD().catch(console.error);

module.exports = { create, read, update, remove };
