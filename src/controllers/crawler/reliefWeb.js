import request from "request";
import fs from "fs";
import path from "path";
import debug from "debug";

const app = "callforcode";
const error = debug(`${app}:error`);
const log = debug(`${app}:crawler`);

const API_URL = "https://api.reliefweb.int/v1/reports";
const FILE_PATH = path.join(__dirname, "../..", "data/relief_data.json");

const writeToFile = ({ filePath = FILE_PATH, data = "", flag = "w" }) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, data, { flag: flag }, err => {
			if (err) reject(err);
			else resolve();
		});
	});
};

const _fetch = ({ url = API_URL, method = "GET", body = {} }) => {
	return new Promise((resolve, reject) => {
		request(
			url,
			{
				method: method,
				body: JSON.stringify(body)
			},
			(err, res, body) => {
				if (!err) resolve(JSON.parse(body));
				else reject(err);
			}
		);
	});
};

exports.fetchRelieftWeb = (options = null) => {
	if (!options) {
		error("no options found.");
		return;
	}

	return new Promise(async (resolve, reject) => {
		const allReportQuery = {
			url: API_URL,
			method: "POST",
			body: options
		};

		try {
			const reportsResult = await _fetch(allReportQuery);
			const length = reportsResult.data.length;
			log(`length ${length}`);

			let dataToWrite = [];

			reportsResult.data.forEach(async (datum, i) => {
				const datumDetails = await _fetch({ url: datum.href });
				datum.fields = {
					...datum.fields,
					...datumDetails.data[0].fields
				};

				dataToWrite.push(datum);

				if (length - 1 === i) {
					log(`data length ${dataToWrite.length}`);

					await writeToFile({ data: JSON.stringify(dataToWrite) });
					resolve("write file finished.");
				}
			});
		} catch (e) {
			error(`err: ${e}`);
			reject(e);
		}
	});
};
