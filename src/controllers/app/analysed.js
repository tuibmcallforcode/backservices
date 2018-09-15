import { reliefweb_analysed } from "../../models";

export async function getAll() {
	return await reliefweb_analysed.model.find({});
}

export async function getPaginated({ limit = 0, page = 0, target = null }) {
	const documents = await reliefweb_analysed.model
		.find({})
		.limit(Number(limit))
		.skip(Number(page));

	if (target) {
		const results = [];
		for (let doc of documents) {
			doc = await doc.translate({ targetLan: target });
			results.push({
				relief_id: doc.relief_id,
				title: doc.translated[target].title,
				description: doc.translated[target].description,
				source: doc.source,
				time: doc.time,
				severity: doc.severity,
				loc: doc.loc,
				latitude: doc.latitude,
				longitude: doc.longitude,
				body: doc.translated[target].body,
				brief_body: doc.translated[target].brief_body,
				categories: doc.categories
			});
		}
		return results;
	}
	return data;
}
