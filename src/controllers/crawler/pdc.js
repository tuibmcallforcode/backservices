import request from "request";
import fs from "fs";
import path from "path";
import XMLExtract from "xml-extract";
import XMLParser from "xml2json";
import { log } from "./constants";
import { pdc as PDC } from "../../models";

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
		const { id } = datum;
		return new Promise((resolve, reject) => {
			PDC.update(
				{ id },
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

function formatDatumToModel(JSONData) {
	const {
		hazardBean: {
			uuid: id,
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
		id,
		title,
		latitude,
		longitude,
		severity,
		description,
		source,
		time
	};

	return datum;
}

function getPDCAlert() {
	return new Promise(async (resolve, reject) => {
		const alertXmlQuery = {
			url: API_URL
		};

		try {
			const XMLData = await _fetch(alertXmlQuery);

			let data = [];
			XMLExtract(XMLData, "hazardBean", true, async (err, element) => {
				if (err) log(err);
				else {
					const JSONString = XMLParser.toJson(element);
					const JSONData = JSON.parse(JSONString);
					const datum = await formatDatumToModel(JSONData);

					data.push(datum);
				}
			});

			resolve(data);
		} catch (e) {
			log(`err: ${e}`);
			reject(e);
		}
	});
}

export async function fetchPDC() {
	return new Promise(async (resolve, reject) => {
		const data = await getPDCAlert();

		const promises = upsertAll(data);
		Promise.all(promises)
			.then(resolve)
			.catch(reject);
	});
}

export function getAllPDCData() {
	return new Promise((resolve, reject) => {
		PDC.find({})
			.then(resolve)
			.catch(reject);
	});
}
