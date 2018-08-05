import "../env";

import { serve, shutdown } from "./web";
import { closeConnection } from "./db/mongo";
import debugMain from "debug";
import mongoose from "mongoose";

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
mongoose.connect('mongodb://root:example@localhost:27017/',(err)=>{
	if(err)
		console.log(err);
})

serve({ port });
