const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hugomayonobe:NS0Vs2b4NvKRsfe0@cluster0.s0q6mkc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connect() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();
    return client.db('cluster0').collection('ws_masks');
}

async function create(mask) {
  const collection = await connect();
  const result = await collection.insertOne(mask);
  return { _id: result.insertedId, ...mask };
}

async function read(id) {
  const collection = await connect();
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function update(id, mask) {
  const collection = await connect();
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: mask });
  return await read(id);
}

async function remove(id) {
  const collection = await connect();
  await collection.deleteOne({ _id: new ObjectId(id) });
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD MongoDB...");
  
    // Création
    const mask = { description: "Test Mask", name: "Test Name", mask_json: { example: true } };
    const created = await create(mask);
    console.log("Document créé:", created);
  
    // Lecture
    const readDoc = await read(created._id);
    console.log("Document lu:", readDoc);
  
    // Mise à jour
    const updatedInfo = { description: "Updated Mask", name: "Updated Name", mask_json: { example: false } };
    const updated = await update(created._id, updatedInfo);
    console.log("Document mis à jour:", updated);
  
    // Suppression
    await remove(created._id);
    console.log("Document supprimé.");
  
    // Vérifier la suppression
    const verifyRemove = await read(created._id);
    console.log("Vérification après suppression:", verifyRemove);
  
    console.log("Fin du test CRUD MongoDB.");
}
  
testCRUD().catch(console.error);

module.exports = { create, read, update, remove };
