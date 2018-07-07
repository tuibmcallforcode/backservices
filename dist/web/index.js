"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.serve = serve;
exports.shutdown = shutdown;

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = new _koa2.default(),
      debug = (0, _debug2.default)("callforcode:webserver");

let server;

function serve({ port }) {
	debug("serve options %o", arguments);
	server = _http2.default.createServer(app.callback()).listen(port);
	console.log(`server is listening to ${port}`);
}

function shutdown() {
	return new Promise(reslove => {
		server.close(function () {
			reslove();
		});
	});
}