import { analyze } from "../../controllers/ibm/nlu.js";
import { translate } from "../../controllers/ibm/translate.js";
import { origin, pdc } from "../../models/index.js";
import { insertRelief, insertPdc } from "../../controllers/crawler";

// // for test
// import { readFileSync } from "fs";
// import { join } from "path";
// let testPath = join(__dirname, "../../../testcase/crawler/");
// let testCase = JSON.parse(readFileSync(testPath + "relief.json"));
// let testCasePdc = JSON.parse(readFileSync(testPath + "pdc.json"));

async function nluAnalyzeHandler(ctx) {
	const { text } = ctx.request.body;
	let analyzed = await analyze(text);
	ctx.body = analyzed;
}

async function translateHandler(ctx) {
	const { text, target, source } = ctx.request.body;
	let translated = await translate({ text, target, source });
	ctx.body = translated;
}
const routes = [
	{
		method: "post",
		path: "/nlu/analyze",
		middlewares: [],
		handler: nluAnalyzeHandler
	},
	{
		method: "post",
		path: "/translate",
		middlewares: [],
		handler: translateHandler
	}
];

export default routes;
