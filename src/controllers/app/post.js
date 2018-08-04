import { Cards } from "../../models/cards";
export async function getPosts(params = {}) {
	return null;
}

export async function getCards({ lang = "en" }) {
	return await Cards();
}
