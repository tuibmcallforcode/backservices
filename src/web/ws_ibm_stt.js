import WebSocket from "ws";
import wav from "wav";
import { Readable } from "stream";
import { NewSpeechToTextModule } from "../controllers/ibm/stt";

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", async function connection(ws) {
	let data = null;
	const sttWS = await NewSpeechToTextModule({}, function onMessage(evt) {
		console.log(evt);
	});
	ws.on("message", function incoming(message) {
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
		sttWS.send(JSON.stringify({ action: "stop" }));
	});
});

export default wss;
