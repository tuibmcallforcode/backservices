import request from "request";
import fs from "fs";
import path from "path";
import debug from "debug";
import XMLExtract from "xml-extract";
import XMLParser from "xml2json";

const app = "callforcode";
const error = debug(`${app}:error`);
const log = debug(`${app}:crawler`);

const API_URL = "https://hpxml.pdc.org/public.xml";
const FILE_PATH = path.join(__dirname, "../..", "data/pdc_data.json");

const writeToFile = ({ filePath = FILE_PATH, data = "", flag = "w" }) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, data, { flag: flag }, err => {
			if (err) reject(err);
			else resolve();
		});
	});
};

const _fetch = ({ url = API_URL }) => {
	return new Promise((resolve, reject) => {
		request(url, (err, res, body) => {
			if (!err) resolve(body);
			else reject(err);
		});
	});
};

exports.fetchPDC = () => {
	return new Promise(async (resolve, reject) => {
		const alertXmlQuery = {
			url: API_URL
		};

		try {
			const XMLData = await _fetch(alertXmlQuery);

			let dataToWrite = [];
			XMLExtract(XMLData, "hazardBean", true, (err, element) => {
				if (err) error(err);
				else {
					let JSONString = XMLParser.toJson(element);
					let JSONData = JSON.parse(JSONString);
					dataToWrite.push(JSONData.hazardBean);
				}
			});

			writeToFile({ data: JSON.stringify(dataToWrite) });
		} catch (e) {
			error(`err: ${e}`);
			reject(e);
		}
	});
};
