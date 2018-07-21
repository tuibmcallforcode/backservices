var mongoose = require("mongoose");
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

const Pdc = mongoose.model("pdc", pdcSchema);
module.exports = Pdc;
