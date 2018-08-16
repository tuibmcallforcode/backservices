import { analyze } from "../ibm/nlu";
import { reliefweb_analysed } from "../../models";
import { reliefweb_raw } from "../../models";

const categories = ["flood","earthquake","hurricane","tornado","nuclear accident","volcanic eruptions","environmental disaster","meteorological disaster",];
export async function startAnalyse() {
	const raw_data = await reliefweb_raw.model.find({}, { _id: 0 });
	const filter_data = await raw_data.filter(data => data.body);
	const analyze_data = [];
	try {
		for (let element of filter_data) {
			const nlu_data = await analyze(element.body);
			for (let i = 0; i < nlu_data.categories.length; i++) {
				const { label } = nlu_data.categories[i];
				const {
					relief_id,
					title,
					description,
					source,
					time,
					severity,
					latitude,
					longitude,
					body,
				} = element;
				const data = { relief_id,
					title,
					description,
					source,
					time,
					severity,
					latitude,
					longitude,
					body,
					categories: "", 
					brief_body: "" };

					categories.forEach(async category => {
					if (label.includes(category)) {
						const { subject } = nlu_data.semantic_roles[0];
						data.categories = category;
						data.brief_body = subject.text;
						analyze_data.push(data);
						await reliefweb_analysed.model.create(data);
						return;
					}
				});
			}
		}
	} catch (e) {
		console.log(e);
	}
	console.log(analyze_data);
	return analyze_data;
}
