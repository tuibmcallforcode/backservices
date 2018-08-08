import mongoose from "mongoose";
var Schema = mongoose.Schema;

var pdcSchema = new Schema({
	last_Update: Date,
	hazard_Name: String,
	snc_url: String,
	description: String,
	latitude: Number,
	longitude: Number,
	type_ID: String, //TSUNAMI, TORNADO
	severity_ID: String //INFORMATION, WATCH
});

const PDC = mongoose.model("pdc", pdcSchema);
export let model = PDC;
