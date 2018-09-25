const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { serve, shutdown } = require("web");

import logger from "./logger";
const port = process.env.PORT || 3000;

// graceful shutdown
["SIGINT", "SIGTERM", "SIGQUIT", "SIGUSR2"].forEach(signal =>
	process.on(signal, async () => {
		logger.info("receive termination signal, shutting down");
		try {
			await shutdown();
			logger.debug("close webserver success");
		} catch (e) {
			logger.error("shutdown: ", e);
			process.exit(1);
		}
		process.exit(0);
	})
);

serve({ port });
