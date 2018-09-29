import { Readable } from "stream";

import { reliefweb_raw } from "../../models";
import logger from "../../logger";

export async function crawlToStream({ offset = 0, query }) {
	const reliefWebRawModelObjects = await reliefweb_raw.fetchRawReliefWeb(
		{ offset, query },
		{}
	);
	const s = new Readable();
	s._read = () => {};
	s.push(JSON.stringify(reliefWebRawModelObjects));
	s.push(null);
	return s;
}

export async function crawlToDB({ offset = 0, query }) {
	let result = {};
	const reliefwebModels = await reliefweb_raw.fetchRawReliefWeb(
		{ offset, query },
		{ mongoose: true }
	);
	result.data = reliefwebModels;
	try {
		result.upserted = await Promise.all(
			reliefwebModels.map(async model => {
				const { relief_id } = model;
				const updateResult = await reliefweb_raw.model.update(
					{ relief_id },
					model,
					{
						upsert: true,
						setDefaultsOnInsert: true
					}
				);
				return updateResult;
			})
		);
		return result;
	} catch (e) {
		logger.error({
			error: e
		});
		result.error = e;
		return result;
	}
}
