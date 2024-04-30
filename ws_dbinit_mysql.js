const connectMySQL = require('./ws_connect_mysql')

async function initDb() {
  const connection = await connectMySQL();

  try {
    // drop tables if they exist
    await connection.execute(`
      DROP TABLE IF EXISTS ws_entries;
    `);

    await connection.execute(`
      DROP TABLE IF EXISTS ws_masks;
    `);

    // Création de la table ws_masks
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ws_masks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255),
        name VARCHAR(50),
        mask_json JSON
      );
    `);

    // Création de la table ws_entries
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ws_entries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_mask INT,
        entry_json JSON,
        CONSTRAINT fk_mask
          FOREIGN KEY (id_mask) 
          REFERENCES ws_masks(id)
          ON DELETE CASCADE
      );
    `);

    console.log("Initialisation de la base de données MySQL terminée.");

  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données MySQL:", error);
  } finally {
    await connection.end();
  }
}

initDb().catch(console.error);
