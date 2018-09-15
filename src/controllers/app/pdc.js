import { pdc } from "../../models";

export async function getNear({ lon, lat }) {
	const maxDistance = 1000000;
	return await pdc.model.find({
		loc: {
			$nearSphere: {
				$geometry: {
					type: "Point",
					coordinates: [lon, lat]
				},
				$maxDistance: maxDistance
			}
		}
	});
}

export async function getAll() {
	return await pdc.model.find({});
}
