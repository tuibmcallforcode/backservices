import WebSocket from "ws";
import wav from "wav";
import { Readable } from "stream";
import logger from "../logger";
import { NewSpeechToTextModule } from "../controllers/ibm/stt";

const wss = new WebSocket.Server({ noServer: true });

function isJSON(item) {
	item = typeof item !== "string" ? JSON.stringify(item) : item;

	try {
		item = JSON.parse(item);
	} catch (e) {
		return false;
	}

	if (typeof item === "object" && item !== null) {
		return true;
	}

	return false;
}

wss.on("connection", async function connection(ws) {
	let data = null;
	let sttWS;
	try {
		sttWS = await NewSpeechToTextModule(
			{},
			function onOpen() {
				ws.send(JSON.stringify({ status: "open" }));
			},
			function onMessage(evt) {
				ws.send(evt);
			}
		);
	} catch (e) {
		logger.error(e);
		return;
	}
	ws.on("message", function incoming(message) {
		if (!sttWs) {
			logger.error("unable to connect to ibm sst socket");
			return;
		}
		// if json , send it directly to server
		if (isJSON(message)) {
			logger.debug("received message", message);
			sttWS.send(message);
			return;
		}

		const totalLength = data ? data.length + message.length : 0;
		data = data ? Buffer.concat([data, message], totalLength) : message;
		if (sttWS.readyState == 1) {
			sttWS.send(message);
		}
	});

	ws.on("close", function close() {
		const fileWriter = new wav.FileWriter("demo.wav", {
			channels: 1,
			sampleRate: 44100,
			bitDepth: 16
		});

		const readable = new Readable();
		readable._read = () => {}; // _read is required but you can noop it
		readable.push(data);
		readable.push(null);

		readable.pipe(fileWriter);
		readable.on("end", function() {
			fileWriter.end();
		});
	});
});

export default wss;
