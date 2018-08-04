import "../env";

import { serve, shutdown } from "./web";
import { closeConnection } from "./db/mongo";
import debugMain from "debug";

const port = process.env.PORT || 3000,
	debug = debugMain("callforcode:main");

// graceful shutdown
["SIGINT", "SIGTERM", "SIGQUIT", "SIGUSR2"].forEach(signal =>
	process.on(signal, async () => {
		debug(
			"receive termination signal, shutting down ",
			Date().toLocaleUpperCase()
		);
		try {
			await shutdown();
			await closeConnection();
		} catch (e) {
			console.error("shutdown: ", e);
		}
		process.exit();
	})
);

serve({ port });
