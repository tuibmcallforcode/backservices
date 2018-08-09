import mongoose from "mongoose";
import rp from "request-promise-native";
import { parseString } from "xml2js";

var Schema = mongoose.Schema;

const pdcSchema = new Schema({
	pdc_id: String,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	latitude: String, //latitude
	longitude: String //longtitude
});

const PDC = mongoose.model("pdc", pdcSchema);
export let model = PDC;

const API_URL = "https://hpxml.pdc.org/public.xml";

export async function fetchPDC() {
	const XMLDataString = await rp(API_URL);
	const XMLDatas = await _parsePDCXML(XMLDataString);

	const resultList = XMLDatas.map(XMLData => {
		return _mapPDCToMongooseModel(XMLData);
	});
	console.log(resultList);
	return resultList;
}

export function _parsePDCXML(xmlString) {
	if (!xmlString) {
		return Promise.reject("invalid parameter");
	}
	return new Promise((resolve, reject) => {
		parseString(xmlString, function(err, data) {
			if (err) {
				return reject(err);
			}
			return resolve(data.hazardBeans.hazardBean);
		});
	});
}

export function _mapPDCToMongooseModel(pdcData) {
	const {
		uuid: pdc_id,
		hazard_Name: title,
		latitude,
		longitude,
		severity_ID: severity,
		description,
		snc_url: source,
		update_Date: time
	} = pdcData;

	return new PDC({
		pdc_id,
		title,
		latitude,
		longitude,
		severity,
		description,
		source,
		time
	});
}
