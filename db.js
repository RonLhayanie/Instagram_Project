<<<<<<< HEAD
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://itamarmatasco:TOEZupkmEOYtk8HS@cluster0.fueifpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

async function connectDB() {
    await client.connect();
    console.log('✅ MongoDB connected');
    return client.db('Instagram');
}

module.exports = connectDB();
=======
const {MongoClient} = require('mongodb');
const uri='mongodb+srv://itamarmatasco:TOEZupkmEOYtk8HS@cluster0.fueifpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(uri);
const db = client.db('Instagram');

module.exports = db
>>>>>>> 4dc233729b78c89c74dfbee474fb7935580f46d3
