import { createLogger, format, transports } from "winston";
const { combine, timestamp, colorize } = format;

const printingFormat =
	process.env.NODE_ENV === "production"
		? combine(timestamp(), format.json())
		: combine(format.splat(), colorize(), format.simple());

let logger = createLogger({
	level: process.env.LOG_LEVEL || "debug",
	format: printingFormat,
	transports: [
		new transports.Console({
			level: process.env.LOG_LEVEL || "debug",
			stderrLevels: ["error"],
			consoleWarnLevels: ["warn"]
		})
	]
});

export default logger;
