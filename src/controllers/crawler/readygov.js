import { prepareness } from "../../models";
import logger from "../../logger";

const categories = [
	"flood",
	"earthquake",
	"hurricane",
	"tornado",
	"nuclear accident"
];

export async function crawlToStream() {
	let result = [];

	for (let category of categories) {
		const preparenessDocuments = await prepareness.fetchReadyGOV({
			category,
			mongoose: true
		});
		result.append(preparenessDocuments);
	}
	const s = new Readable();
	s._read = () => {}; // redundant? see update below
	s.push(JSON.stringify(result));
	s.push(null);
	return s;
}

export async function crawlToDB() {
	let result = { data: {} };
	let preparenessDocuments = [];
	for (let category of categories) {
		const preparenessDocument = await prepareness.fetchReadyGOV({
			category,
			mongoose: true
		});
		preparenessDocuments.push(preparenessDocument);
	}
	result.data.category = preparenessDocuments;
	try {
		result.upserted = await Promise.all(
			preparenessDocuments.map(async model => {
				const { category } = model;
				const updateResult = await prepareness.model.update({ category }, model, {
					upsert: true,
					setDefaultsOnInsert: true
				});
				return updateResult;
			})
		);
		return result;
	} catch (e) {
		console.log(e);
		logger.error({
			error: JSON.stringify(e)
		});
		result.error = e;
		return result;
	}
}
