import NaturalLanguageUnderstandingV1 from "watson-developer-cloud/natural-language-understanding/v1";

const VERSION = "2018-03-16";

console.log({
	version: VERSION,
	iam_apikey:
		process.env.NLU_API_KEY || "SvHbHa-hATbO8z2hKA9LQem1Q-2Ps9vpSnJzi7s3hIQV"
});
let naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
	version: VERSION,
	iam_apikey:
		process.env.NLU_API_KEY || "SvHbHa-hATbO8z2hKA9LQem1Q-2Ps9vpSnJzi7s3hIQV",
	url: "https://gateway.watsonplatform.net/natural-language-understanding/api/"
});

var parameters = {
	text:
		"IBM is an American multinational technology company headquartered in Armonk, New York, United States, with operations in over 170 countries.",
	features: {
		entities: {
			emotion: true,
			sentiment: true,
			limit: 2
		},
		keywords: {
			emotion: true,
			sentiment: true,
			limit: 2
		}
	}
};

naturalLanguageUnderstanding.analyze(parameters, function(err, response) {
	if (err) console.log("error:", err);
	else console.log(JSON.stringify(response, null, 2));
});
