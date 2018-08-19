import * as pdc from "../../controllers/crawler/pdc";
import * as relief from "../../controllers/crawler/relief";
import * as analyzed from "../../controllers/crawler/analysed";

async function pdcStreamHandler(ctx) {
	try {
		ctx.set("Content-disposition", `attachment; filename=pdc_${new Date()}`);
		ctx.set("Content-type", "application/json");
		const s = await pdc.crawlToStream();
		ctx.body = s;
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

async function pdcDBHandler(ctx) {
	try {
		const result = await pdc.crawlToDB();
		ctx.body = result;
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

async function reliefStreamHandler(ctx) {
	try {
		const { offset, query } = ctx.query;
		ctx.set("Content-disposition", `attachment; filename=relief_${new Date()}`);
		ctx.set("Content-type", "application/json");
		const s = await relief.crawlToStream({ offset, query }, {});
		ctx.body = s;
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

async function reliefDBHandler(ctx) {
	try {
		const { offset, query } = ctx.query;
		const result = await relief.crawlToDB({ offset, query }, {});
		ctx.body = result;
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

async function reliefAnalyzedHandler(ctx) {
	try {
		const result = await analyzed.startAnalyse();	
		ctx.body = result;
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

const routes = [
	{
		method: "post",
		path: `/pdc/stream`,
		middlewares: [],
		handler: pdcStreamHandler
	},
	{
		method: "post",
		path: `/pdc/db`,
		middlewares: [],
		handler: pdcDBHandler
	},
	{
		method: "post",
		path: `/relief/stream`,
		middlewares: [],
		handler: reliefStreamHandler
	},
	{
		method: "post",
		path: `/relief/db`,
		middlewares: [],
		handler: reliefDBHandler
	},
	{
		method: "post",
		path: `/analyzed/relief/db`,
		middlewares: [],
		handler: reliefAnalyzedHandler
	}
];

export default routes;
