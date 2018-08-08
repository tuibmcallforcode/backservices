import mongoose from "mongoose";
import rp from "request-promise-native";
import parallelLimit from "async/parallelLimit";
import logger from "../logger";

const Schema = mongoose.Schema;

const reliefwebRawSchema = new Schema({
	fields: {
		date: {
			original: Date,
			changed: Date,
			created: Date
		},
		country: [
			{
				name: String,
				shortname: String,
				iso3: String,
				location: { latด: Number, lon: Number },
				primary: Boolean
			}
		],
		primary_country: {
			name: String,
			shortname: String,
			iso3: String,
			location: { lat: Number, lon: Number }
		},
		title: String,
		body: String,
		url: String,
		id: {
			type: String,
			unique: true
		},
		origin: String,
		language: [{ id: Number, name: String, code: String }],
		disaster_type: [{ id: Number, name: String, code: String }]
	}
});

let ReliefwebRaw = mongoose.model("reliefweb_raw", reliefwebRawSchema);
export let model = ReliefwebRaw;

// utility const for reliefweb
const API_URL = "https://api.reliefweb.int/v1/reports";
export const QUERY_EARTHQUAKE = "earthquake";

export async function fetchRawReliefWeb({ offset, query }) {
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
		reportContentList = await _fetchReportsContent({ reportURLList });
	} catch (e) {
		logger.error("_fetchReportsContent", e);
		return;
	}
	let resultList = [];
	reportList.forEach((report, index) => {
		const contentData = reportContentList[index].data
			? reportContentList[index].data[0].fields
			: {};
		resultList.push({
			...report.fields,
			...contentData
		});
	});
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
		query: {
			value: query
		},
		profile: "list",
		limit: offset + (Number(process.env.RELIEF_REQ_LIM) || 100),
		sort: ["date:desc"]
	};
	logger.debug("_fetchRawReports request params", reportRequestParams);

	const { data } = await rp.post(API_URL, {
		body: reportRequestParams,
		json: true
	});

	return data;
}

export function _fetchReportsContent({ reportURLList = [] }) {
	if (!Array.isArray(reportURLList) && reportURLList.length === 0) {
		logger.warn("invalid params", reportURLList);
		return;
	}
	const parallelFuncsList = reportURLList.map(reportURL => {
		return function(callback) {
			rp(reportURL, {
				json: true
			})
				.then(reportDetail => {
					callback(null, reportDetail);
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
