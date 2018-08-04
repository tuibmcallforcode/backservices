import { getPosts, getCards } from "../../controllers/app/post.js";

const TYPE_CARD = "card";

async function getPostsHandler(ctx) {
	const { type } = ctx.request.query;

	switch (type) {
		case TYPE_CARD:
			let cardResults = await getCards({});
			ctx.body = cardResults;
			break;
		default:
			ctx.throw(400, "not found");
	}
}

const routes = [
	{
		method: "get",
		path: "/posts",
		middlewares: [],
		handler: getPostsHandler
	}
];

export default routes;
