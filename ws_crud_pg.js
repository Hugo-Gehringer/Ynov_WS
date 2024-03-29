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

async function createMask(description, name, mask_json) {
  const result = await pool.query(
    'INSERT INTO ws_masks(description, name, mask_json) VALUES ($1, $2, $3) RETURNING *;',
    [description, name, mask_json]
  );
  return result.rows[0];
}

async function readMask(id) {
  const result = await pool.query('SELECT * FROM ws_masks WHERE id = $1;', [id]);
  return result.rows[0];
}

async function updateMask(id, description, name, mask_json) {
  const result = await pool.query(
    'UPDATE ws_masks SET description = $2, name = $3, mask_json = $4 WHERE id = $1 RETURNING *;',
    [id, description, name, mask_json]
  );
  return result.rows[0];
}

async function removeMask(id) {
  const result = await pool.query('DELETE FROM ws_masks WHERE id = $1 RETURNING *;', [id]);
  return result.rows[0];
}

async function createEntry(id_mask, entry_json) {
  const result = await pool.query(
    'INSERT INTO ws_entries(id_mask, entry_json) VALUES ($1, $2) RETURNING *;',
    [id_mask, entry_json]
  );
  return result.rows[0];
}

async function readEntry(id) {
  const result = await pool.query('SELECT * FROM ws_entries WHERE id = $1;', [id]);
  return result.rows[0];
}

async function updateEntry(id, id_mask, entry_json) {
  const result = await pool.query(
    'UPDATE ws_entries SET id_mask = $2, entry_json = $3 WHERE id = $1 RETURNING *;',
    [id, id_mask, entry_json]
  );
  return result.rows[0];
}

async function removeEntry(id) {
  const result = await pool.query('DELETE FROM ws_entries WHERE id = $1 RETURNING *;', [id]);
  return result.rows[0];
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD...");

    // Test pour ws_masks
    console.log("Testing ws_masks...");
    const maskJson = { example: true };
    const createdMask = await createMask("Test Description", "Test Name", JSON.stringify(maskJson));
    console.log("Masque créé:", createdMask);

    const readMaskResult = await readMask(createdMask.id);
    console.log("Masque lu:", readMaskResult);

    const updatedMask = await updateMask(createdMask.id, "Updated Description", "Updated Name", JSON.stringify({ example: false }));
    console.log("Masque mis à jour:", updatedMask);

    // Test pour ws_entries
    console.log("Testing ws_entries...");
    const entryJson = { data: "Test Entry" };
    const createdEntry = await createEntry(createdMask.id, JSON.stringify(entryJson));
    console.log("Entrée créée:", createdEntry);

    const readEntryResult = await readEntry(createdEntry.id);
    console.log("Entrée lue:", readEntryResult);

    const updatedEntry = await updateEntry(createdEntry.id, createdMask.id, JSON.stringify({ data: "Updated Entry" }));
    console.log("Entrée mise à jour:", updatedEntry);

    
    await removeEntry(createdEntry.id);
    console.log("Entrée supprimée.");

    await removeMask(createdMask.id);
    console.log("Masque supprimé.");

    console.log("Fin du test CRUD.");
    await pool.end();
}

testCRUD().catch(console.error);

module.exports = { createMask, readMask, updateMask, removeMask, createEntry, readEntry, updateEntry, removeEntry };