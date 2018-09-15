import mongoose from "mongoose";
import rp from "request-promise-native";
import { parseString } from "xml2js";

const Schema = mongoose.Schema;

const pdcSchema = new Schema({
	pdc_id: String,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	loc: {
		type: { type: String, default: "Point" },
		coordinates: [Number]
	}
});

pdcSchema.index({ loc: "2dsphere" });

const PDC = mongoose.model("pdc", pdcSchema);
export let model = PDC;

const API_URL = "https://hpxml.pdc.org/public.xml";

export async function fetchPDC({ mongoose = false }) {
	const XMLDataString = await rp(API_URL);
	const XMLDatas = await _parsePDCXML(XMLDataString);

	let resultList = XMLDatas.map(XMLData => {
		return _mapPDCToModel(XMLData);
	});
	if (mongoose) {
		resultList = resultList.map(result => new PDC(result));
	}
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

export function _mapPDCToModel(pdcData) {
	const {
		uuid: pdc_id,
		hazard_Name: title,
		longitude,
		latitude,
		severity_ID: severity,
		description,
		snc_url: source,
		update_Date: time
	} = pdcData;

	return {
		pdc_id,
		title,
		loc: {
			type: "Point",
			coordinates: [parseFloat(longitude), parseFloat(latitude)]
		},
		severity,
		description,
		source,
		time
	};
}
