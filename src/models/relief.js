import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reliefSchema = new Schema({
	id: String,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	latitude: String, //latitude
	longitude: String, //longtitude
	body: String
});

const relief = mongoose.model("relief", reliefSchema);
module.exports = relief;
