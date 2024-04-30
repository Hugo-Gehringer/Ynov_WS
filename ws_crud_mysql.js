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

// Opérations CRUD pour ws_masks
async function createMask(description, name, mask_json) {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute(
        'INSERT INTO ws_masks(description, name, mask_json) VALUES (?, ?, ?);',
        [description, name, JSON.stringify(mask_json)]
    );
    await connection.end();
    return rows.insertId;
}

async function readMask(id) {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute('SELECT * FROM ws_masks WHERE id = ?;', [id]);
    await connection.end();
    return rows[0];
}

async function readAllMasks() {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute('SELECT * FROM ws_masks;');
    await connection.end();
    return rows;
}

async function updateMask(id, description, name, mask_json) {
    const connection = await mysql.createConnection(connectionConfig);
    await connection.execute(
        'UPDATE ws_masks SET description = ?, name = ?, mask_json = ? WHERE id = ?;',
        [description, name, JSON.stringify(mask_json), id]
    );
    await connection.end();
    return readMask(id);
}

async function removeMask(id) {
    const connection = await mysql.createConnection(connectionConfig);
    await connection.execute('DELETE FROM ws_masks WHERE id = ?;', [id]);
    await connection.end();
}

// Opérations CRUD pour ws_entries
async function createEntry(id_mask, entry_json) {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute(
        'INSERT INTO ws_entries(id_mask, entry_json) VALUES (?, ?);',
        [id_mask, JSON.stringify(entry_json)]
    );
    await connection.end();
    return rows.insertId;
}

async function readEntry(id) {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute('SELECT * FROM ws_entries WHERE id = ?;', [id]);
    await connection.end();
    return rows[0];
}

async function readAllEntries() {
    const connection = await mysql.createConnection(connectionConfig);
    const [rows] = await connection.execute('SELECT * FROM ws_entries;');
    await connection.end();
    return rows;
}

async function updateEntry(id, id_mask, entry_json) {
    const connection = await mysql.createConnection(connectionConfig);
    await connection.execute(
        'UPDATE ws_entries SET id_mask = ?, entry_json = ? WHERE id = ?;',
        [id_mask, JSON.stringify(entry_json), id]
    );
    await connection.end();
    return readEntry(id);
}

async function removeEntry(id) {
    const connection = await mysql.createConnection(connectionConfig);
    await connection.execute('DELETE FROM ws_entries WHERE id = ?;', [id]);
    await connection.end();
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD MySQL...");

    // Test pour ws_masks
    console.log("Testing ws_masks...");
    const maskJson = { example: true };
    const createdMaskId = await createMask("Test Description", "Test Name", maskJson);
    console.log("Masque créé, id:", createdMaskId);

    const readedMask = await readMask(createdMaskId);
    console.log("Masque lu:", readedMask);

    const updatedMaskJson = { example: false };
    await updateMask(createdMaskId, "Updated Description", "Updated Name", updatedMaskJson);
    console.log("Masque mis à jour");

    // Test pour ws_entries
    console.log("Testing ws_entries...");
    const entryJson = { data: "Test Entry" };
    const createdEntryId = await createEntry(createdMaskId, entryJson);
    console.log("Entrée créée, id:", createdEntryId);

    const readedEntry = await readEntry(createdEntryId);
    console.log("Entrée lue:", readedEntry);

    const updatedEntryJson = { data: "Updated Entry" };
    await updateEntry(createdEntryId, createdMaskId, updatedEntryJson);
    console.log("Entrée mise à jour");

    // Nettoyage
    await removeEntry(createdEntryId);
    console.log("Entrée supprimée.");

    await removeMask(createdMaskId);
    console.log("Masque supprimé.");

    console.log("Fin du test CRUD MySQL.");
}

// testCRUD().catch(console.error);

module.exports = { createMask, readMask, readAllMasks, updateMask, removeMask, createEntry, readEntry, readAllEntries, updateEntry, removeEntry };