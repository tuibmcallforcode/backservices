import mongoose from "mongoose";
const Schema = mongoose.Schema;

const pdcSchema = new Schema({
	_id: { type: String, unique: true }, //uuid
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	latitude: String, //latitude
	longitude: String //longtitude
});

const PDC = mongoose.model("pdc", pdcSchema);
module.exports = PDC;
