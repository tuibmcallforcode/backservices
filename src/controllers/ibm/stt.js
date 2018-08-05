if (
	!process.env.STT_TOKEN &&
	(!process.env.STT_USERNAME && !process.env.STT_PASSWORD)
) {
	console.error("env for Speech to text not found");
	process.exit(400);
}
import WebSocket from "ws";
import debugSTT from "debug";
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
		console.log(e);
		throw e;
	}
}

const debug = debugSTT("callforcode:speech_to_text"),
	wsURI =
		"wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize" +
		"?watson-token={{token}}";

export async function NewSpeechToTextModule(params, _onOpen, _onMessage) {
	const token = await getAuthToken();
	const requestURI = wsURI.replace("{{token}}", token);
	const ws = new WebSocket(requestURI);

	ws.on("open", function open() {
		debug("ibm socket opened");
		_onOpen();
	});

	ws.on("message", function onMessage(evt) {
		// debug("received message, %o", evt);
		_onMessage(evt);
	});

	ws.on("close", function close() {
		console.log("disconnected");
	});
	return ws;
}
