const {MongoClient} = require('mongodb');
const uri='mongodb+srv://itamarmatasco:TOEZupkmEOYtk8HS@cluster0.fueifpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const client = new MongoClient(uri);
const db = client.db('Instagram');

module.exports = db