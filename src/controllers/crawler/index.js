import { origin, pdc } from "../../models";

export async function insertRelief(parameters) {
	try {
		const obj = await origin.create(parameters);
		return obj
	} catch (e) {
		throw e;
	}
}

export async function insertPdc(parameters) {
	try {
		pdc.create(parameters).then(obj=>{obj}).catch(err=>{err})
		return obj
	} catch (e) {
		throw e;
	}
}

export async function analyze(text) {
	const parameters = Object.assign({}, { text }, nluParams);
	return await analyzeAsync(parameters);
}
