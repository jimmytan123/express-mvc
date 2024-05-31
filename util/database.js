const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  // MongoDB Altas
  MongoClient.connect(
    'mongodb+srv://jimmy:T1G2DA4RfHxeKzn0@cluster0.rueh8it.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then((client) => {
      console.log('connected with MongoDB');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Helper method to get the db instance if it exists
const getDb = () => {
  if (_db) {
    return _db;
  }

  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
