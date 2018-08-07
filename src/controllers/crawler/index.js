import { origin, pdc } from "../../models";

export async function insertRelief(parameters) {
	return await origin.create(parameters);
}

export async function insertPdc(parameters) {
	return await pdc.create(parameters);
}

export async function analyze(text) {
	const parameters = Object.assign({}, { text }, nluParams);
	return await analyzeAsync(parameters);
}
// import { fetchRelieftWeb } from "./reliefWeb";
// import { fetchPDC } from "./pdc";
// const option = {
// 	offset: 0,
// 	query: {
// 		value: "earthquake"
// 	},
// 	profile: "list",
// 	limit: 100,
// 	sort: ["date:desc"]
// };

// fetchRelieftWeb(option);
// fetchPDC();
