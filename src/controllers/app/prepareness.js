import { prepareness } from "../../models";

export async function getByCategory({ category }) {
	return await prepareness.model.find({ category });
}
