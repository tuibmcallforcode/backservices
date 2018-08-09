import { reliefweb_raw } from "../../models";

export async function getAll() {
	return await reliefweb_raw.model.find({});
}
