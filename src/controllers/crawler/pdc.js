import request from "request";
import fs from "fs";
import path from "path";
import debug from "debug";
import XMLExtract from "xml-extract";
import XMLParser from "xml2json";

import { pdc as PDC } from "../../models";

const app = "callforcode";
const log = debug(`${app}:controllers`);

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

const upsertAll = data => {
	return data.map(datum => {
		const { _id } = datum;
		return new Promise((resolve, reject) => {
			PDC.update(
				{ _id: _id },
				datum,
				{ upsert: true, setDefaultsOnInsert: true },
				(err, ele) => {
					if (err) reject(err);
					else resolve(ele);
				}
			);
		});
	});
};
export function fetchPDC() {
	return new Promise(async (resolve, reject) => {
		const alertXmlQuery = {
			url: API_URL
		};

		try {
			const XMLData = await _fetch(alertXmlQuery);

			let data = [];
			XMLExtract(XMLData, "hazardBean", true, (err, element) => {
				if (err) log(err);
				else {
					const JSONString = XMLParser.toJson(element);
					const JSONData = JSON.parse(JSONString);
					const {
						hazardBean: {
							uuid: _id,
							hazard_Name: title,
							latitude,
							longitude,
							severity_ID: severity,
							description,
							snc_url: source,
							update_Date: time
						}
					} = JSONData;

					const datum = {
						_id,
						title,
						latitude,
						longitude,
						severity,
						description,
						source,
						time
					};

					data.push(datum);
				}
			});

			const promises = upsertAll(data);
			Promise.all(promises)
				.then(resolve)
				.catch(reject);
		} catch (e) {
			log(`err: ${e}`);
			reject(e);
		}
	});
}

export function getAllPDCData() {
	return new Promise((resolve, reject) => {
		PDC.find({})
			.then(resolve)
			.catch(reject);
	});
}
