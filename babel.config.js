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
	const plugins = [
		"dynamic-import-node-babel-7",
		"@babel/plugin-proposal-object-rest-spread"
	];
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
