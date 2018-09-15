import { reliefweb_analysed } from "../../models";
import { translateAnalysed } from "../crawler/analysed";

export async function getAll(query) {
	if (query) {
		const { limit, page, target } = query;
		const data = await reliefweb_analysed.model
			.find({}, { _id: 0, __v: 0 })
			.limit(Number(limit))
			.skip(Number(page));
		if (target) {
			const results = [];
			for (let value of data) {
				const dataObj = value.toObject();
				let {
					relief_id,
					title, //hazard_Name
					description, //description
					source, //snc_url
					time, //update_Date
					severity, //severity_ID
					loc,
					latitude, //latitude
					longitude, //longtitude
					body,
					brief_body,
					categories
				} = dataObj;
				let translateResult = await translateAnalysed({target}, { relief_id });
				let { detail } = translateResult;
				detail = detail.find(data => {
					if (data.language === target) return data;
				});
				
				const result = {
					relief_id,
					title, //hazard_Name
					description, //description
					source, //snc_url
					time, //update_Date
					severity, //severity_ID
					loc,
					latitude, //latitude
					longitude, //longtitude
					body,
					brief_body,
					categories,
					...detail
				};
				results.push(result);
			}
			return results;
		}
		return data;
	}
	return await reliefweb_analysed.model.find({});
}
