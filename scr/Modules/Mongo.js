const Mongoose = require("mongoose")
const Secrets = require('./Secrets.js');
const Path = require('path');
const fs = require('fs');
const Mongo = Secrets.Mongo;
const StorageDir = Path.join(__dirname, "../","Schemas")
const SchemasDir = fs.readdirSync(StorageDir)

const Connection = Mongoose.createConnection(Mongo);

function GenerateName(FileName) {
    const Step1 = FileName.replace('Schema', '')
    const Step2 = Step1.replace('.js', '')

    return Step2
}

function LoadSchemas() {
  for (SchemaFile of SchemasDir) {
    const Code = require(Path.join(StorageDir, SchemaFile))
    const Name = GenerateName(SchemaFile)

    Connection.model(Name, Code)
  }
}

LoadSchemas()

module.exports = Connection
