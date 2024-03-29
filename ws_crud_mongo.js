const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://hugomayonobe:NS0Vs2b4NvKRsfe0@cluster0.s0q6mkc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connect(collectionName) {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    return client.db('cluster0').collection(collectionName);
}

// Opérations CRUD pour ws_masks
async function createMask(mask) {
  const collection = await connect('ws_masks');
  const result = await collection.insertOne(mask);
  return { _id: result.insertedId, ...mask };
}

async function readMask(id) {
  const collection = await connect('ws_masks');
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function updateMask(id, mask) {
  const collection = await connect('ws_masks');
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: mask });
  return await readMask(id);
}

async function removeMask(id) {
  const collection = await connect('ws_masks');
  await collection.deleteOne({ _id: new ObjectId(id) });
}

// Opérations CRUD pour ws_entries
async function createEntry(entry) {
    const collection = await connect('ws_entries');
    const result = await collection.insertOne(entry);
    return { _id: result.insertedId, ...entry };
}

async function readEntry(id) {
    const collection = await connect('ws_entries');
    return await collection.findOne({ _id: new ObjectId(id) });
}

async function updateEntry(id, entry) {
    const collection = await connect('ws_entries');
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: entry });
    return await readEntry(id);
}

async function removeEntry(id) {
    const collection = await connect('ws_entries');
    await collection.deleteOne({ _id: new ObjectId(id) });
}

// Test du CRUD
async function testCRUD() {
    console.log("Début du test CRUD MongoDB...");

    // Test pour ws_masks
    console.log("Testing ws_masks...");
    const mask = { description: "Test Mask", name: "Test Name", mask_json: { example: true } };
    const createdMask = await createMask(mask);
    console.log("Masque créé:", createdMask);

    const readMaskResult = await readMask(createdMask._id);
    console.log("Masque lu:", readMaskResult);

    const updatedMaskInfo = { description: "Updated Description", name: "Updated Name", mask_json: { example: false } };
    const updatedMask = await updateMask(createdMask._id, updatedMaskInfo);
    console.log("Masque mis à jour:", updatedMask);

    // Test pour ws_entries
    console.log("Testing ws_entries...");
    const entry = { id_mask: createdMask._id.toString(), entry_json: { data: "Test Entry" } };
    const createdEntry = await createEntry(entry);
    console.log("Entrée créée:", createdEntry);

    const readEntryResult = await readEntry(createdEntry._id);
    console.log("Entrée lue:", readEntryResult);

    const updatedEntryInfo = { id_mask: createdMask._id.toString(), entry_json: { data: "Updated Entry" } };
    const updatedEntry = await updateEntry(createdEntry._id, updatedEntryInfo);
    console.log("Entrée mise à jour:", updatedEntry);

    await removeEntry(createdEntry._id);
    console.log("Entrée supprimée.");

    await removeMask(createdMask._id);
    console.log("Masque supprimé.");

    console.log("Fin du test CRUD MongoDB.");
}
  
testCRUD().catch(console.error);


module.exports = { createMask, readMask, updateMask, removeMask, createEntry, readEntry, updateEntry, removeEntry };
