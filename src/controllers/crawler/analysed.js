import { analyze } from "../ibm/nlu";
import { reliefweb_analysed } from "../../models";
import { reliefweb_raw } from "../../models";
import logger from "../../logger";
import { translate } from "../../controllers/ibm/translate";

const categories = [
	"flood",
	"earthquake",
	"hurricane",
	"tornado",
	"nuclear accident",
	"volcanic eruptions",
	"environmental disaster",
	"meteorological disaster"
];
export async function startAnalyse() {
	let analyzedResults = [];
	try {
		let rawDatas = await reliefweb_raw.model.find({}, { _id: 0 });
		for (let rawData of rawDatas) {
			rawData = rawData.toObject();
			const nluData = await analyze(rawData.body);
			let category;
			const isInCriteria = nluData.categories.some(({ label }) =>
				categories.some(c => {
					if (label.includes(c)) {
						category = c;
						return true;
					}
					return false;
				})
			);
			if (!isInCriteria) {
				continue;
			}
			const model = {
				categories: category,
				brief_body: nluData.semantic_roles[0].subject.text,
				...rawData
			};
			const analyzedResult = await reliefweb_analysed.model.update(
				{ relief_id: rawData.relief_id },
				model,
				{
					upsert: true,
					setDefaultsOnInsert: true
				}
			);
			analyzedResults.push(analyzedResult);
		}
	} catch (e) {
		throw e;
	}
	logger.info({
		message: `analyzed ${analyzedResults.length} datas`
	});
	return analyzedResults;
}

export async function translateAnalysed(language , query) {
	try {
		const { target } = language;
		let queries = query||{};
		
		let analysedData = await reliefweb_analysed.model.findOne(
			queries,
			{ _id: 0, __v: 0 }
		);
		analysedData = analysedData.toObject();
		if (analysedData.detail) {
			const detail = analysedData.detail.some(data => data.language === target);
			if (detail) {
				return analysedData;
			} else {
				const { title, description, body, brief_body } = analysedData;
				let translated_data = {};
				translated_data.title = await translate({
					text: title,
					target: target,
					source: "en"
				});
				translated_data.description = await translate({
					text: description,
					target: target,
					source: "en"
				});
				translated_data.body = await translate({
					text: body,
					target: target,
					source: "en"
				});
				translated_data.brief_body = await translate({
					text: brief_body,
					target: target,
					source: "en"
				});
				translated_data.language = target;
				analysedData.detail.push(translated_data);
				await reliefweb_analysed.model.update(
					{ relief_id: analysedData.relief_id },
					analysedData,
					{
						upsert: true,
						setDefaultsOnInsert: false
					}
				);
				return analysedData;
			}
		}
	} catch (e) {
		logger.debug(e);
	}
}
