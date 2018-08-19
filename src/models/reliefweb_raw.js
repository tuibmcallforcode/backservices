import mongoose from "mongoose";
import rp from "request-promise-native";
import qs from "querystring";

import parallelLimit from "async/parallelLimit";
import logger from "../logger";

const Schema = mongoose.Schema;

const reliefwebRawSchema = new Schema({
	relief_id: Number,
	title: String, //hazard_Name
	description: String, //description
	source: String, //snc_url
	time: String, //update_Date
	severity: String, //severity_ID
	loc: {
		type: { type: String, default: "Point" },
		coordinates: [Number]
	},
	body: String
});
reliefwebRawSchema.index({ loc: "2dsphere" });

let ReliefwebRaw = mongoose.model("reliefweb_raw", reliefwebRawSchema);
export let model = ReliefwebRaw;

// utility const for reliefweb
const API_URL = "https://api.reliefweb.int/v1/disasters";

export async function fetchRawReliefWeb(
	{ offset, query },
	{ mongoose = false }
) {
	let reportList;
	try {
		reportList = await _fetchRawReports({ offset: offset, query });
	} catch (e) {
		logger.error("_fetchRawReports", e);
		return;
	}

	// get source link of each report
	const reportURLList = reportList.map(report => {
		return report.href;
	});
	let reportContentList;
	try {
		reportContentList = await _fetchReportsContentFromReportURLList(
			reportURLList
		);
	} catch (e) {
		logger.error("_fetchReportsContent", e);
		return;
	}

	let resultList = reportContentList.map(_mapContentToModel);

	if (mongoose) {
		return resultList.map(result => new ReliefwebRaw(result));
	}
	return resultList;
}

// const option = {
// 	offset: 0,
// 	query: {
// 		value: "earthquake"
// 	},
// 	profile: "list",
// 	limit: 100,
// 	sort: ["date:desc"]
// };
export async function _fetchRawReports({ offset, query }) {
	const reportRequestParams = {
		offset,
		query: query
			? {
					value: query
			  }
			: null,
		profile: "list",
		limit: offset + (Number(process.env.RELIEF_REQ_LIM) || 100),
		sort: ["date:desc"]
	};
	logger.debug("_fetchRawReports request params", reportRequestParams);
	const { data } = await rp.post(API_URL, {
		body: reportRequestParams,
		qs: { appname: process.env.RELIEF_APPNAME || null },
		json: true
	});

	return data;
}

export function _fetchReportsContentFromReportURLList(reportURLList = []) {
	if (!Array.isArray(reportURLList) && reportURLList.length === 0) {
		logger.warn("invalid params", reportURLList);
		return;
	}
	const parallelFuncsList = reportURLList.map(reportURL => {
		return function(callback) {
			rp(reportURL, {
				json: true,
				appname: process.env.RELIEF_APPNAME || null
			})
				.then(({ data }) => {
					callback(null, data[0]);
				})
				.catch(e => {
					// dont throw if single url cannot retrive
					logger.error(e);
					callback(null, {});
				});
		};
	});

	return new Promise((resolve, reject) => {
		logger.debug(
			"adding urls to retrive content, data counts = %d",
			reportURLList.length
		);
		parallelLimit(parallelFuncsList, 5, function(err, reportDetailList) {
			if (err) {
				return reject(err);
			}
			return resolve(reportDetailList);
		});
	});
}

export function _mapContentToModel(data) {
	const {
		id: relief_id,
		fields: {
			name: title,
			primary_country: {
				location: { lat: latitude, lon: longitude }
			},
			type,
			description,
			url: source,
			date: { created: time }
		}
	} = data;
	const { name: severity } = type[0];
	const body = description;

	const datum = {
		relief_id,
		title,
		severity,
		description,
		source,
		time,
		body,
		loc: {
			coordinates: [longitude, latitude]
		}
	};
	return datum;
}
