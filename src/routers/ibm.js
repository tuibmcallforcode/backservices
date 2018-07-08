import { analyze } from "../controllers/ibm/nlu.js";
import { translate } from "../controllers/ibm/translate";

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
	},
	{
		method: "get",
		path: "/",
		middlewares: [],
		handler: ctx => {
			ctx.body = { r: "hello from ibm" };
		}
	}
];

export default routes;
