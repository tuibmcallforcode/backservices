import { getCollection } from "../db/mongo";

import debugMain from "debug";

const COLLECTION_NAME = "cards";
const debug = debugMain("callforcode:model_cards");

export async function Cards() {
	let collection = await getCollection(COLLECTION_NAME);
	let docs = await collection.find({}).toArray();
	return docs;
}
