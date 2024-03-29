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

async function create(description, name, mask_json) {
  const result = await pool.query(
    'INSERT INTO ws_masks(description, name, mask_json) VALUES ($1, $2, $3) RETURNING *;',
    [description, name, mask_json]
  )

  return result.rows[0];
}

async function read(id) {
  const result = await pool.query('SELECT * FROM ws_masks WHERE id = $1;', [id])
    
  return result.rows[0];
}

async function update(id, description, name, mask_json) {
  const result = await pool.query(
    'UPDATE ws_masks SET description = $2, name = $3, mask_json = $4 WHERE id = $1 RETURNING *;',
    [id, description, name, mask_json]
  )

  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query('DELETE FROM ws_masks WHERE id = $1 RETURNING *;', [id])
    
  return result.rows[0];
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD...");
  
    // Création
    const maskJson = { example: true };
    const created = await create("Test Description", "Test Name", JSON.stringify(maskJson));
    console.log("Création réussie:", created);
  
    // Lecture
    const readMask = await read(created.id);
    console.log("Lecture réussie:", readMask);
  
    // Mise à jour
    const updatedMaskJson = { example: false };
    const updated = await update(created.id, "Updated Description", "Updated Name", JSON.stringify(updatedMaskJson));
    console.log("Mise à jour réussie:", updated);
  
    // Suppression
    const removed = await remove(created.id);
    console.log("Suppression réussie:", removed);
  
    // Vérifier la suppression
    const verifyRemove = await read(created.id);
    console.log("Vérification après suppression:", verifyRemove);
  
    console.log("Fin du test CRUD.");

    pool.end();
}
  
testCRUD().catch(console.error);

module.exports = { create, read, update, remove };
