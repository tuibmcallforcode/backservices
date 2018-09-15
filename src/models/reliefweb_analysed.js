import mongoose from "mongoose";

const analysedSchema = new mongoose.Schema({
	relief_id: Number,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	loc: {
		type: { type: String, default: "Point" },
		coordinates: [Number]
	},
	latitude: String, //latitude
	longitude: String, //longtitude
	body: String,
	brief_body: String,
	categories: String,
	detail: [
		{
			language: String,
			title: String, //hazard_Name
			description: String, //description
			body: String,
			brief_body: String
		}
	]
});
analysedSchema.index({ loc: "2dsphere" });

const Analysed = mongoose.model("reliefweb_analysed", analysedSchema);
export let model = Analysed;
