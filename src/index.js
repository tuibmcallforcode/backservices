import "../env";

import { serve, shutdown } from "./web";
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
