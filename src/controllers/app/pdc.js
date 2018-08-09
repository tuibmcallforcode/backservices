import { pdc } from "../../models";

export async function getAll() {
	return await pdc.model.find({});
}
