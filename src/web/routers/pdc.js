import { getAllPDCData, fetchPDC } from "../../controllers/crawler/pdc";

async function pdcHandler(ctx) {
	try {
		const data = await getAllPDCData();
		ctx.body = { data: data };
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

async function fetchHandler(ctx) {
	try {
		const data = await fetchPDC();
		ctx.body = { data: data };
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

const routes = [
	{
		method: "get",
		path: "/",
		middlewares: [],
		handler: pdcHandler
	},
	{
		method: "get",
		path: "/fetch",
		middlewares: [],
		handler: fetchHandler
	}
];

export default routes;
