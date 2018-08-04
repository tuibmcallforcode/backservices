import request from "request";
import fs from "fs";
import path from "path";
import { log } from "./constants";
import { relief as Relief } from "../../models";

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

function upsertAll(data) {
	// log(`data: ${JSON.stringify(data[0])}`);
	return data.map(datum => {
		const { id } = datum;
		return new Promise((resolve, reject) => {
			Relief.update(
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
}

function formatDatumToModel(JSONData) {
	// console.log(`json ${JSON.stringify(JSONData)}`);
	const {
		id,
		fields: {
			name: title,
			primary_country: {
				location: { lat: latitude, long: longitude }
			},
			type,
			description,
			url: source,
			date: { created: time }
		}
	} = JSONData;
	const { name: severity } = type[0];
	const body = description;

	const datum = {
		id,
		title,
		latitude,
		longitude,
		severity,
		description,
		source,
		time,
		body
	};

	return datum;
}

function getDisastersReport() {
	return new Promise(async (resolve, reject) => {
		const API_URL =
			"https://api.reliefweb.int/v1/disasters?appname=tuibmcfc&limit=1000&sort[]=date:desc";

		const query = {
			url: API_URL,
			method: "GET"
		};

		try {
			const disasters = await _fetch(query);
			let { data } = disasters;
			const length = data.length;

			data = await Promise.all(
				data.map((datum, i) => {
					return new Promise(async (resolve, reject) => {
						while (true) {
							try {
								const { href } = datum;
								const datumDetails = await _fetch({ url: href });
								datum.fields = Object.assign(datum.fields, datumDetails.data[0].fields);
								resolve(datum);
								break;
							} catch (err) {
								log(`err ${err}, ${JSON.stringify(datum)}`);
							}
						}
					});
				})
			);
			resolve(data);
		} catch (e) {
			log(`err: ${e}`);
			reject(e);
		}
	});
}

export async function fetchRelieftWeb() {
	return new Promise(async (resolve, reject) => {
		try {
			let disasters = await getDisastersReport();
			disasters = await Promise.all(
				disasters.map(datum => {
					return new Promise((resolve, reject) => {
						try {
							resolve(formatDatumToModel(datum));
						} catch (err) {
							log(`err ${err}`);
							reject(err);
						}
					});
				})
			);
			resolve(await upsertAll(disasters));
		} catch (err) {
			log(`err ${err}`);
			reject(err);
		}
	});
}

export function getAllReliefData() {
	return new Promise((resolve, reject) => {
		Relief.find({})
			.then(resolve)
			.catch(reject);
	});
}
