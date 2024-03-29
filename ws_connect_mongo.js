const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hugomayonobe:NS0Vs2b4NvKRsfe0@cluster0.s0q6mkc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectMongoDB() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  try {
    await client.connect();
    console.log("Connecté à MongoDB !");
    return client;
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    throw error;
  }
}

module.exports = connectMongoDB;

if (require.main === module) {
  connectMongoDB().then(client => {
    client.close();
  }).catch(console.error);
}
