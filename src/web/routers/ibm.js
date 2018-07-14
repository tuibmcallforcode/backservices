import { analyze } from "../../controllers/ibm/nlu.js";
import { translate } from "../../controllers/ibm/translate";
import { readFileSync } from "fs";
import { join } from "path"

let testPath = join(__dirname, "../../../testcase/clawler/");
let testCase = JSON.parse(readFileSync(testPath+"clawler.json"));

async function nluAnalyzeHandler(ctx) {
	const { text } = ctx.request.body;
	let analyzed = await analyze(text);
	ctx.body = analyzed;
}

async function nluAnalyzeClawerHandler(ctx) {
	const body = testCase.filter((element) => element.fields.body)
		.map((element) => element.fields.body);
	let result = [];
	for (let text of body) {
		let analyzed = await analyze(text);
		result.push(analyzed);
	}
	const json = JSON.stringify(result);
	ctx.body = result;
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
	},
	{
		method: "get",
		path: "/",
		middlewares: [],
		handler: ctx => {
			ctx.body = { r: "hello from ibm" };
		}
	},
	{
		method: "get",
		path: "/nlu/claw",
		middlewares: [],
		handler: nluAnalyzeClawerHandler
	}
];

export default routes;
