if (
	!process.env.STT_TOKEN &&
	(!process.env.STT_USERNAME && !process.env.STT_PASSWORD)
) {
	console.error("env for Speech to text not found");
	process.exit(1);
}
import WebSocket from "ws";
import logger from "../../logger";
import axios from "axios";

const AUTH_URL = "https://stream.watsonplatform.net/authorization/api/v1/token";
const URL_PARAMS = "https://stream.watsonplatform.net/speech-to-text/api";

async function getAuthToken() {
	if (process.env.STT_TOKEN) {
		return process.env.STT_TOKEN;
	}
	try {
		const { data } = await axios.get(AUTH_URL, {
			params: {
				url: URL_PARAMS
			},
			auth: {
				username: process.env.STT_USERNAME,
				password: process.env.STT_PASSWORD
			}
		});
		return data["token"];
	} catch (e) {
		logger.error(e);
		throw e;
	}
}

const wsURI =
	"wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize" +
	"?watson-token={{token}}";

export async function NewSpeechToTextModule(params, _onOpen, _onMessage) {
	const token = await getAuthToken();
	const requestURI = wsURI.replace("{{token}}", token);
	const ws = new WebSocket(requestURI);

	ws.on("open", function open() {
		logger.debug("ibm socket opened");
		_onOpen();
	});

	ws.on("message", function onMessage(evt) {
		_onMessage(evt);
	});

	ws.on("close", function close() {
		logger.debug("ibm socket disconnected");
	});
	return ws;
}
