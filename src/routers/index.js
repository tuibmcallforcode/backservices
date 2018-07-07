import fs from "fs";
import path from "path";
import Router from "koa-router";
const readDirPath = path.resolve(__dirname);

// module level variable
let router = new Router();

// foreach routes, assign to router
function buildRoute(routes, prefix) {
	routes.forEach(route => {
		const middlewaresAndHandler = [...route.middlewares, route.handler];

		router[route.method](`/${prefix}${route.path}`, ...middlewaresAndHandler);
	});
}

function readFileListExecptIndex(readDirPath) {
	const routesFileList = fs.readdirSync(readDirPath);
	return routesFileList.filter(file => file != "index.js");
}

function requireAndBuildRouteFromFileList(fileList) {
	fileList.forEach(file => {
		const importPath = path.resolve(__dirname, file);
		const prefix = path.basename(file, ".js");
		let routes;
		try {
			let defaultRoutes = require(importPath);
			routes = defaultRoutes.default;
		} catch (e) {
			throw Error("cannot import file", file, ":", e);
		}
		buildRoute(routes, prefix);
	});
}

const fileList = readFileListExecptIndex(readDirPath);

requireAndBuildRouteFromFileList(fileList);

export default router;
