import { Readable } from "stream";

import { pdc } from "../../models";
import logger from "../../logger";

export async function crawlToStream() {
	const pdcModelObjects = await pdc.fetchPDC({});
	const s = new Readable();
	s._read = () => {}; // redundant? see update below
	s.push(JSON.stringify(pdcModelObjects));
	s.push(null);
	return s;
}

export async function crawlToDB() {
	let result = {};
	const pdcModels = await pdc.fetchPDC({});
	result.data = pdcModels;
	try {
		result.upserted = await Promise.all(
			pdcModels.map(async model => {
				const { pdc_id } = model;
				const updateResult = await pdc.model.update({ pdc_id }, model, {
					upsert: true,
					setDefaultsOnInsert: true
				});
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

export function getAllPDCData() {
	return new Promise((resolve, reject) => {
		pdc.model
			.find({})
			.then(resolve)
			.catch(reject);
	});
}
