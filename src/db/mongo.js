if (!process.env.MONGO_CONN && !process.env.MONGO_DB) {
	console.error("env for mongo not found");
	process.exit(400);
}
import debugMain from "debug";
const debug = debugMain("callforcode:mongo");

import { MongoClient } from "mongodb";

const connURL = process.env.MONGO_CONN;
const dbName = process.env.MONGO_DB;
let client;

async function connect() {
	debug("client is connecting to mongo");

	client = await MongoClient.connect(connURL);
	debug("client connected");
}

export async function getCollection(collection) {
	if (!client || !client.isConnected()) {
		debug("client is not connecting to mongo");
		await connect();
	}
	debug("getCollection returning client");

	return client.db(dbName).collection(collection);
}

export async function closeConnection() {
	if (client) {
		await client.close();
	}
}
