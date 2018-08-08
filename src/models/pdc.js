import mongoose from "mongoose";
var Schema = mongoose.Schema;

const pdcSchema = new Schema({
	id: String,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	latitude: String, //latitude
	longitude: String //longtitude
});

const PDC = mongoose.model("pdc", pdcSchema);
export let model = PDC;
