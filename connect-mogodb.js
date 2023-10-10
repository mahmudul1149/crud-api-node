const { MongoClient } = require("mongodb");
require("dotenv/config");
const url =
  "mongodb+srv://imdmahmudul237:mahmud237@cluster0.hbanzl4.mongodb.net/?retryWrites=true&w=majority";
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(url, mongoOptions);

module.exports = client;
