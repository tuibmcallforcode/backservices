if (
	!process.env.TLE_IAM &&
	(!process.env.TLE_USERNAME && !process.env.TLE_PASSWORD)
) {
	console.error("env for translate not found");
	process.exit(1);
}

import LanguageTranslatorV3 from "watson-developer-cloud/language-translator/v3";
import logger from "../../logger";

const VERSION = "2018-05-01";

const authParams = process.env.TLE_IAM
	? { iam_apikey: process.env.TLE_IAM }
	: {
			username: process.env.TLE_USERNAME,
			password: process.env.TLE_PASSWORD
	  };

const languageTranslator = new LanguageTranslatorV3(
	Object.assign({}, { version: VERSION }, authParams)
);

function translateAsync(parameters) {
	return new Promise((resolve, reject) => {
		languageTranslator.translate(parameters, (err, response) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(response);
			return;
		});
	});
}

export async function translate({ text, source, target }) {
	const parameters = { text, source, target };
	logger.debug("translating %s, params %O", textDebug, nluParams);

	return await translateAsync(parameters);
}
