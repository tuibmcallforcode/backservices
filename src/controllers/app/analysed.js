import { reliefweb_analysed } from "../../models"

export async function getAll() {
	return await reliefweb_analysed.model.find({});
}
