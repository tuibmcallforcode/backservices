if (!process.env.MONGO_CONN && !process.env.MONGO_DB) {
	console.error("env for mongo not found");
	process.exit(1);
}
import { readdir } from "fs";
import logger from "../logger";
import mongoose from "mongoose";

const connURL = process.env.MONGO_CONN;
const dbName = process.env.MONGO_DB;
const conn = `${connURL}${dbName}?authSource=admin`;
// mongoose.set("debug", true);

try {
	logger.debug("connecting to mongodb querystring %s", conn);
	mongoose.connect(
		conn,
		{ useNewUrlParser: true }
	);
	logger.info("connected to mongodb");
} catch (e) {
	logger.error(e);
	process.exit(1);
}

readdir(__dirname, (err, files) => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
	files.forEach(function(file) {
		/*
		* initializes all models and sources them as .model-name
		*/
		if (file !== "index.js" && file !== ".gitkeep") {
			const moduleName = file.split(".")[0];
			exports[moduleName] = require("./" + moduleName);
		}
	});
});
