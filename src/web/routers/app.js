import { getAll as getAllPDC } from "../../controllers/app/pdc.js";
import { getAll as getAllReliefRaw } from "../../controllers/app/relief";
import { getAll as getAllAnalysed } from "../../controllers/app/analysed";
import { getByCategory } from "../../controllers/app/prepareness";

async function getPDCHandler(ctx) {
	try {
		ctx.body = await getAllPDC({});
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}
async function getReliefRawHandler(ctx) {
	try {
		ctx.body = await getAllReliefRaw({});
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}
async function getAnalyzedHandler(ctx) {
	try {
		ctx.body = await getAllAnalysed({});
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

async function getPreparenessHandler(ctx) {
	try {
		const { category } = ctx.params;
		ctx.body = await getByCategory({ category });
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}

const routes = [
	{
		method: "get",
		path: "/pdcs",
		middlewares: [],
		handler: getPDCHandler
	},
	{
		method: "get",
		path: "/relief_raws",
		middlewares: [],
		handler: getReliefRawHandler
	},
	{
		method: "get",
		path: "/analysed",
		middlewares: [],
		handler: getAnalyzedHandler
	},
	{
		method: "get",
		path: "/prepareness/:category",
		middlewares: [],
		handler: getPreparenessHandler
	}
];

export default routes;
