const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://itamarmatasco:TOEZupkmEOYtk8HS@cluster0.fueifpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

async function connectDB() {
    await client.connect();
    console.log('✅ MongoDB connected');
    return client.db('Instagram');
}

module.exports = connectDB();
