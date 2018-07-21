import { analyze } from "../../controllers/ibm/nlu.js";
import { translate } from "../../controllers/ibm/translate";
import { readFileSync } from "fs";
import { join } from "path";
import { origin, pdc } from "../../models";

let testPath = join(__dirname, "../../../testcase/clawler/");
let testCase = JSON.parse(readFileSync(testPath + "clawler.json"));
let testCasePdc = JSON.parse(readFileSync(testPath + "pdc.json"));
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

async function clawHandler(ctx) {
	try{
	const obj = await origin.create(testCase);
	ctx.body = Object.assign({}, { message: "success" },obj);
	}
	catch(e){
		console.log(e);
	}
}

async function pdcHandler(ctx) {
	const obj = await pdc.create(testCasePdc);
	ctx.body = Object.assign({}, { message: "success" },obj);
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
		path: "/claw",
		middlewares: [],
		handler: clawHandler
	},
	{
		method: "get",
		path: "/pdc",
		middlewares: [],
		handler: pdcHandler
	}
];

export default routes;
