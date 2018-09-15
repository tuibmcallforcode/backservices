import { getAll as getAllPDC } from "../../controllers/app/pdc.js";
import { getAll as getAllReliefRaw } from "../../controllers/app/relief";
import {
	getAll as getAllAnalysed,
	getPaginated
} from "../../controllers/app/analysed";

async function getPDCHandler(ctx) {
	try {
		ctx.body = await getAllPDC({});
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}
async function getReliefRawHandler(ctx) {
	try {
		ctx.body = await getAllReliefRaw();
	} catch (e) {
		ctx.throw(400, e.stack || e);
	}
}
async function getAnalyzedHandler(ctx) {
	try {
		if (ctx.query.limit && ctx.query.page) {
			ctx.body = await getPaginated(ctx.query);
		} else {
			ctx.body = await getAllReliefRaw();
		}
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
	}
];

export default routes;
