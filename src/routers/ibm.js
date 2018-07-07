import { analyze } from "../controllers/ibm/nlu.js";

async function nluAnalyze(ctx) {
	const { text } = ctx.request.body;
	let analyzed = await analyze(text);
	console.log(analyzed);
	ctx.body = analyzed;
}

const routes = [
	{
		method: "post",
		path: "/analyze",
		middlewares: [],
		handler: nluAnalyze
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
