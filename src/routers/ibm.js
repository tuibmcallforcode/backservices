const routes = [
	{
		method: "get",
		path: "/",
		middlewares: [],
		handler: ctx => {
			ctx.body = { r: "hello from ibm" };
		}
	}
];

export default routes;
