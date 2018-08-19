import { analyze } from "../ibm/nlu";
import { reliefweb_analysed } from "../../models";
import { reliefweb_raw } from "../../models";
import logger from "../../logger";

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
