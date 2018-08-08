module.exports = function(api) {
	api.cache(true);
	const presets = [
		[
			"@babel/preset-env",
			{
				targets: {
					node: "current"
				}
			}
		]
	];
	const plugins = ["dynamic-import-node-babel-7"];
	const env = {
		test: {
			presets: [
				[
					"env",
					{
						modules: "commonjs"
					}
				]
			]
		}
	};
	return {
		presets,
		plugins,
		env
	};
};
