import path from "path";
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const debug = require("debug")("db-setup");
import { MongoClient } from "mongodb";

const connection = process.env.CONNECTION || ""
let client = new MongoClient(connection, { useNewUrlParser: true, useUnifiedTopology: true })

let connected = false;

export async function getConnectedClient() {
  if (connected) {
    return client;
  }
  debug("######## Connecting  ###########")
  client = await client.connect();
  connected = true;
  return client;
}
export async function closeConnection() {
  if (connected) {
    connected = false;
    await client.close();
    debug("######## Connection Closed ###########")
  }
}





