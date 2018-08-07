import Koa from "koa";
import debugWeb from "debug";
import http from "http";
import url from "url";
import router from "./routers";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";

import sttIBMWebSocket from "./ws_ibm_stt";
import winstonLogger from "../logger";

const app = new Koa(),
	debug = debugWeb("callforcode:webserver");

let server;

export function serve({ port }) {
	winstonLogger.debug("serve options, %O", arguments);

	app.use(
		logger(str => {
			winstonLogger.info(str);
		})
	);
	app.use(bodyParser());

	app.use(router.routes()).use(router.allowedMethods());

	server = http.createServer(app.callback()).listen(port);

	// add websocket functionality
	server.on("upgrade", function upgrade(request, socket, head) {
		const pathname = url.parse(request.url).pathname;
		if (pathname === "/ws_ibm_stt") {
			sttIBMWebSocket.handleUpgrade(request, socket, head, function done(ws) {
				sttIBMWebSocket.emit("connection", ws, request);
			});
		} else {
			socket.destroy();
		}
	});
	winstonLogger.info(`server is listening to ${port}`);
}

export function shutdown() {
	return new Promise(reslove => {
		server.close(function() {
			reslove();
		});
	});
}
