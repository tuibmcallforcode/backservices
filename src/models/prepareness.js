import mongoose from "mongoose";
import rp from "request-promise-native";
import cheerio from "cheerio";
import { translate } from "../controllers/ibm/translate";

const Schema = mongoose.Schema;

const preparenessSchema = new mongoose.Schema({
	category: String,

	descriptionHTML: String,
	tipsHTML: String,
	prepareHTML: String,
	duringHTML: String,
	afterHTML: String,
	sourceHTML: String,

	descriptionText: String,
	tipsText: String,
	prepareText: String,
	duringText: String,
	afterText: String,
	sourceText: String,

	translated: { type: Object, default: {} }
});

preparenessSchema.methods.translate = async function({ targetLan }) {
	if (this.translated && this.translated[targetLan]) {
		return this;
	}
	const {
		descriptionHTML,
		tipsHTML,
		prepareHTML,
		duringHTML,
		afterHTML,
		sourceHTML,

		descriptionText,
		tipsText,
		prepareText,
		duringText,
		afterText,
		sourceText
	} = this;
	console.log(afterHTML);
	
	let [
		descriptionHTMLT,
		tipsHTMLT,
		prepareHTMLT,
		duringHTMLT,
		afterHTMLT,
		sourceHTMLT,

		descriptionTextT,
		tipsTextT,
		prepareTextT,
		duringTextT,
		afterTextT,
		sourceTextT
	] = await Promise.all([
		translate({
			text: descriptionHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: tipsHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: prepareHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: duringHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: afterHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: sourceHTML,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: descriptionText,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: tipsText,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: prepareText,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: duringText,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: afterText,
			target: targetLan,
			source: "en"
		}),
		translate({
			text: sourceText,
			target: targetLan,
			source: "en"
		})
	]);
	this.translated[targetLan] = {
		descriptionHTML: descriptionHTMLT,
		tipsHTML: tipsHTMLT,
		prepareHTML: prepareHTMLT,
		duringHTML: duringHTMLT,
		afterHTML: afterHTMLT,
		sourceHTML: sourceHTMLT,

		descriptionText: descriptionTextT,
		tipsText: tipsTextT,
		prepareText: prepareTextT,
		duringText: duringTextT,
		afterText: afterTextT,
		sourceText: sourceTextT
	};
	this.markModified("translated");
	return this.save();
};


const Prepareness = mongoose.model("prepareness", preparenessSchema);
export let model = Prepareness;

// "flood",
// "earthquake",
// "hurricane",
// "tornado",
// "nuclear accident"
const mapCategories = {
	flood: "flood",
	earthquake: "earthquake",
	hurricane: "hurricane",
	tornado: "tornado",
	"nuclear accident": "nuclear-power-plants"
};


const READYGOVURL = "https://www.ready.gov/";
export async function fetchReadyGOV({ category, mongoose = false }) {
	const url = `${READYGOVURL}${mapCategories[category]}`;
	const urlResponse = await rp.get(url);
	const $ = cheerio.load(urlResponse);
	const $contentRoot = $(".field-items > .field-item");
	const $contentList = $contentRoot.children();
	let result = { category, source: url };

	$contentList.each(function(index, $content) {
		if (index < 2) {
			// first paragraph
			if (!result.description) {
				result.descriptionText = $(this).text();
				result.descriptionHTML = $(this).html();
			} else {
				result.descriptionText += $(this).text();
				result.descriptionHTML += $(this).html();
			}
			return;
		} else if (index === 3) {
			result.tipsText = $(this).text();
			result.tipsHTML = $(this).html();
			return;
		} else if (index === 6 && category !== "hurricane") {
			result.prepareText = $(this).text();
			result.prepareHTML = $(this).html();
			return;
		} else if (index === 8 && category !== "hurricane") {
			result.duringText = $(this).text();
			result.duringHTML = $(this).html();
			return;
		} else if (index === 10 && category !== "hurricane") {
			result.afterText = $(this).text();
			result.afterHTML = $(this).html();
			return;
		}

		if (index === 5 && category === "hurricane") {
			result.prepareText = $(this).text();
			result.prepareHTML = $(this).html();
			return;
		} else if (index === 15 && category === "hurricane") {
			result.duringText = $(this).text();
			result.duringHTML = $(this).html();
			return;
		} else if (index === 17 && category === "hurricane") {
			result.afterText = $(this).text();
			result.afterHTML = $(this).html();
			return;
		}
	});

	if (mongoose) {
		result = new Prepareness(result);
	}
	return result;
}
