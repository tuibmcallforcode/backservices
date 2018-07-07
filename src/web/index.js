import Koa from "koa";
import debugWeb from "debug";
import http from "http";
import router from "../routers";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";

const app = new Koa(),
	debug = debugWeb("callforcode:webserver");

let server;

export function serve({ port }) {
	debug("serve options %o", arguments);

	app.use(
		logger(str => {
			debug(str);
		})
	);
	app.use(bodyParser());

	app.use(router.routes()).use(router.allowedMethods());

	server = http.createServer(app.callback()).listen(port);
	console.log(`server is listening to ${port}`);
}

export function shutdown() {
	return new Promise(reslove => {
		server.close(function() {
			reslove();
		});
	});
}
