import { prepareness } from "../../models";

export async function getByCategory({ category }) {
	return await prepareness.model.find({ category });
}

export async function getTranslateByCategory({ category, target }) {
	const documents = await prepareness.model.findOne({ category });
	if (target) {
		const doc = await documents.translate({ targetLan: target });
		const {category} = doc;
		const result = {category,...doc.translated[target]};
		return result
	}
	return documents;
}
