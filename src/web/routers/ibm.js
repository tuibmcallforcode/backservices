import { analyze } from "../../controllers/ibm/nlu.js";
import { translate } from "../../controllers/ibm/translate.js";
import { forecastHourlyWeather48hours } from "../../controllers/ibm/weather";
import { translateAnalysed } from "../../controllers/crawler/analysed";

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

async function weatherHandler(ctx) {
	const { latitude, longitude } = ctx.request.body;
	const forecasts = await forecastHourlyWeather48hours({ latitude, longitude });
	ctx.body = forecasts;
}

async function translateAnalyseHandler(ctx) {
	const { target } = ctx.request.body;
	let translated = await translateAnalysed({ target });
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
		method: "post",
		path: "/weather",
		middlewares: [],
		handler: weatherHandler
	},
	{
		method: "post",
		path: "/translate/analyse",
		middlewares: [],
		handler: translateAnalyseHandler
	}
];

export default routes;
