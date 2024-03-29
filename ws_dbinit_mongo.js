const connectMongoDB = require('./ws_connect_mongo');

async function initDb() {
  const client = await connectMongoDB();
  
  try {
    const db = client.db("cluster0");
    
    await db.collection('ws_masks').insertOne({
      description: "Document initial",
      name: "Initial Name",
      mask_json: {}
    });
    
    await db.collection('ws_entries').insertOne({
      id_mask: 1,
      entry_json: {}
    });
    
    console.log("Initialisation des collections MongoDB terminée.");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de MongoDB :", error);
  } finally {
    await client.close();
  }
}

initDb().catch(console.error);
