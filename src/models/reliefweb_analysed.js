import mongoose from "mongoose";
import { translate } from "../controllers/ibm/translate";

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
	translated: { type: Object, default: {} }
});

analysedSchema.index({ loc: "2dsphere" });

analysedSchema.methods.translate = async function({ targetLan }) {
	if (this.translated && this.translated[targetLan]) {
		return this;
	}
	const { title, description, body, brief_body } = this;
	let [titleT, descriptionT, bodyT, brief_bodyT] = await Promise.all([
		translate({
			text: title,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: description,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: body,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: brief_body,
			target: targetLan,
			source: "en"
		})
	]);
	this.translated[targetLan] = {
		title: titleT,
		description: descriptionT,
		body: bodyT,
		brief_body: brief_bodyT
	};

	this.markModified("translated");
	return this.save();
};

const Analysed = mongoose.model("reliefweb_analysed", analysedSchema);
export let model = Analysed;
