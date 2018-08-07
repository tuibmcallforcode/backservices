import { insertRelief, insertPdc } from "../../controllers/crawler";

// // for test
// import { readFileSync } from "fs";
// import { join } from "path";
// let testPath = join(__dirname, "../../../testcase/crawler/");
// let testCase = JSON.parse(readFileSync(testPath + "relief.json"));
// let testCasePdc = JSON.parse(readFileSync(testPath + "pdc.json"));

async function clawHandler(ctx) {
	try {
		const { field } = ctx.request.body;
		const obj = await insertRelief(field);
		ctx.body = Object.assign({}, { message: "success" }, obj);
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

async function clawHandlerTest(ctx) {
	try {
		const obj = await insertRelief(testCase);
		ctx.body = Object.assign({}, { message: "success" }, obj);
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

async function pdcHandlerTest(ctx) {
	try {
		const obj = await insertPdc(testCasePdc);
		ctx.body = Object.assign({}, { message: "success" }, obj);
	} catch (e) {
		ctx.throw(400, e.message);
	}
}

const routes = [
	{
		method: "post",
		path: "/",
		middlewares: [],
		handler: clawHandler
	},
	{
		method: "get",
		path: "/test",
		middlewares: [],
		handler: clawHandlerTest
	},
	{
		method: "get",
		path: "/pdc-test",
		middlewares: [],
		handler: pdcHandlerTest
	}
];

export default routes;
