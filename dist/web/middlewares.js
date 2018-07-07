"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.executeTime = executeTime;
async function executeTime(ctx, next) {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}