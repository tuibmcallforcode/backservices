import {
	fetchRelieftWeb,
	getAllReliefData
} from "../../controllers/app/relief";

async function reliefHandler(ctx) {
	try {
		const data = await getAllReliefData();
		ctx.body = { data: data };
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

async function fetchRelief(ctx) {
	try {
		const data = await fetchRelieftWeb();
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
		handler: reliefHandler
	},
	{
		method: "get",
		path: "/fetch",
		middlewares: [],
		handler: fetchRelief
	}
];

export default routes;
