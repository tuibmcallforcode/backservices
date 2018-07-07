"use strict";

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _web = require("./web");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });

const port = process.env.PORT || 3000,
      debug = (0, _debug2.default)("callforcode:main");

// graceful shutdown
["SIGINT", "SIGTERM", "SIGQUIT", "SIGUSR2"].forEach(signal => process.on(signal, async () => {
	debug("receive termination signal, shutting down ", Date().toLocaleUpperCase());
	try {
		await (0, _web.shutdown)();
	} catch (e) {
		console.error("shutdown: ", e);
	}
	process.exit();
}));

(0, _web.serve)({ port });